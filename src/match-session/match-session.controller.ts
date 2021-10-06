import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { User } from 'src/shared/user-id.decorator'
import {
  CreateMatchSessionDTO,
  UpdateMatchSessionDTO,
} from './match-session.dto'
import { MatchSessionService } from './match-session.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { MatchSession } from './match-session.entity'

// @UseGuards(AuthGuard)
@Controller()
export class MatchSessionController {
  constructor(private matchSessionService: MatchSessionService) {}

  @Post('api/matchsession')
  create(@User() data: CreateMatchSessionDTO) {
    return this.matchSessionService.create(data)
  }

  //untested
  // @Get('api/matchsession/:id')
  // getByUserId(@Param() { id }, @Query() { userstatus, accepted }) {
  //   return this.matchSessionService.getByUserId(id, userstatus, accepted)
  // }

  /**
   * Return all match session where the user is host or guest.
   * @param id - user id.
   */
  // @Get('api/activematchsession/:id')
  // getCurrentMatchSessionByUserId(@Param() { id }) {
  //   return this.matchSessionService.getCurrentMatchSessionByUserId(id)
  // }

  /**
   * Return all match session where the user is host or guest.
   * @param id - user id.
   */
  @Get('api/matchsession/:id')
  getMatchSessionByUserId(@Param() { id }) {
    return this.matchSessionService.getMatchSessionByUserId(id)
  }

  /**
   * Return all unaccepted match session where the user is guest.
   * @param id - user id.
   */
  // @Get('api/unapprovedmatchsession/:id')
  // getInvitesMatchSessionByUserId(@Param() { id }) {
  //   return this.matchSessionService.getInvitesMatchSessionByUserId(id)
  // }

  @Post('api/approvefilm')
  approveFilm(@Body() data: UpdateMatchSessionDTO) {
    return this.matchSessionService.approveFilm(data)
  }

  @Put('api/matchsession/:id')
  update(@Param() { id }, @Body() matchSession: MatchSession) {
    console.log(' id: ', id, 'matchSession: ', matchSession)
    return this.matchSessionService.update(id, matchSession)
  }

  @Delete('api/matchsession/:id')
  delete(@Param() { id }, @Body() matchSession: MatchSession) {
    return this.matchSessionService.delete(id)
  }
}
