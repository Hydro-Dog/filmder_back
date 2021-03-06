import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { UserDTO } from 'src/user/user.dto'
import * as bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {}

  async confirmUser(token: string, userName: string) {
    const isValid = await bcrypt.compare(
      userName + process.env.CONFIRMATION_SECRET,
      token
    )
    if (isValid) {
      const user = await this.userRepository.findOne({ where: { userName } })
      user.emailConfirmed = true
      this.userRepository.save(user)
      return 'Account confirmed'
    } else {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST)
    }
  }

  async refresh(headers: any, refresh: string) {
    try {
      this.jwtService.verify(refresh, { secret: process.env.JWT_SECRET })
    } catch (error) {
      throw new HttpException('Refresh expired', HttpStatus.BAD_REQUEST)
    }

    const payload = this.jwtService.decode(
      headers.authorization.split(' ')[1]
    ) as { [key: string]: any }

    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    })

    const { accessToken } = await this.getAccessToken(user.id)

    user.accessToken = accessToken

    await this.userRepository.update(user.id, user)
    const responseUser = user.sanitizeUser()

    return responseUser
  }

  async login(data: Pick<UserDTO, 'userName' | 'password'>) {
    const { userName, password } = data
    const user = await this.userRepository.findOne({ where: { userName } })
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST
      )
    }

    const [{ accessToken }, { refreshToken }] = await Promise.all([
      this.getAccessToken(user.id),
      this.getRefreshToken(user.id),
    ])

    await this.userRepository.update(user.id, user)
    const responseUser = user.sanitizeUser()
    responseUser.refreshToken = refreshToken
    responseUser.accessToken = accessToken

    return responseUser
  }

  async logout(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new HttpException(
        'Who the duck are you looking for?',
        HttpStatus.BAD_REQUEST
      )
    }

    const loggedOutUser: Partial<User> = {
      ...user,
      accessToken: null,
      refreshToken: null,
    }
    await this.userRepository.update(user.id, loggedOutUser)

    return userId
  }

  async register(data: UserDTO) {
    const { email, userName } = data
    console.log('email: ', email, userName)
    let user = await this.userRepository.findOne({
      where: [{ email }, { userName }],
    })
    console.log('user: ', user)
    if (user) {
      throw new HttpException(
        'User with such email or user name number already exist',
        HttpStatus.BAD_REQUEST
      )
    }

    user = await this.userRepository.create(data)
    console.log('user2: ', user)

    user.password = await this.hashPassword(data.password)
    user.sessionsInvite = []
    // user.activeSessions = []
    user.currentMatchSession = null
    user.emailConfirmed = false
    const token = await bcrypt.hash(
      user.userName + process.env.CONFIRMATION_SECRET,
      10
    )
    console.log('HERE')
    try {
      await this.sendUserConfirmation(user, token)
    } catch (e) {
      console.log('error: ', e)
    }

    console.log('THERE')
    await this.userRepository.save(user)

    return { id: user.id }
  }

  async sendUserConfirmation(user: User, token: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Filmder! Please, confirm your Email',
      template: './registration-confirmation',
      context: {
        name: user.firstName,
        userName: user.userName,
        token,
      },
    })
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
  }

  async getAccessToken(id: string) {
    const payload = {
      id,
    }
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION,
      secret: process.env.JWT_SECRET,
    })

    return { accessToken }
  }

  async getRefreshToken(id: string) {
    const payload = {
      id,
    }
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_EXPIRATION,
      secret: process.env.JWT_SECRET,
    })

    return { refreshToken }
  }
}
