import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import * as bcrypt from 'bcrypt'
import { UserRO } from './user.dto'
import { MatchSession } from 'src/match-session/match-session.entity'

@Entity()
export class User {
  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data)
    }
  }

  @PrimaryGeneratedColumn()
  id: string

  @CreateDateColumn()
  created: Date

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({
    unique: true,
  })
  email: string

  @Column({
    unique: true,
  })
  userName: string

  @Column()
  password: string

  @Column({ nullable: true })
  accessToken: string

  @Column({ nullable: true })
  refreshToken: string

  @Column('text', { nullable: true })
  currentMatchSession: number

  @OneToMany((type) => MatchSession, (matchSession) => matchSession.guest)
  @Column('text', { array: true, nullable: true })
  sessionsInvite: number[]

  @OneToMany((type) => MatchSession, (matchSession) => matchSession.host)
  @Column('text', { array: true, nullable: true })
  createdInvite: string[]

  @Column('text', { array: true, nullable: true })
  favoriteFilms: string[]

  @Column('text', { array: true, nullable: true })
  sessionHistory: string[]

  @Column()
  emailConfirmed: boolean

  @Column('text', { nullable: true })
  phoneNumber: string

  sanitizeUser(hideToken = true): UserRO {
    const {
      id,
      created,
      firstName,
      lastName,
      email,
      userName,
      accessToken,
      phoneNumber,
      currentMatchSession,
    } = this
    const responseObject: UserRO = {
      id,
      created,
      firstName,
      lastName,
      email,
      userName,
      accessToken,
      phoneNumber,
      currentMatchSession,
    }
    return responseObject
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password)
  }
}
