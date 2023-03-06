import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common'

import { UserRepository } from './user.repository'
import { LoginRequestDto } from './../auth/dto/login.request.dto'
import { AuthService } from 'src/auth/auth.service'
import { MessageService } from 'src/message/message.service'
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard'

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly messageService: MessageService
  ) {}

  @Post('/login')
  async login(@Body() body: LoginRequestDto) {
    const access_token = await this.authService.jwtLogin(body)

    return {
      access_token
    }
  }

  @Get('/message')
  @UseGuards(JwtAuthGuard)
  async getUserMessage(@Req() req) {
    const message = await this.messageService.getMessage(req.user.uuid)

    return { message }
  }

  @Post('/signup')
  async signup(@Body() body) {
    await this.userRepository.createUser(body.email, body.password, body.role)
  }
}
