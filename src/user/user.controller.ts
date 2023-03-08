import { Body, Controller, Post } from '@nestjs/common'

import { LoginRequestDto } from './../auth/dto/login.request.dto'
import { AuthService } from 'src/auth/auth.service'
import { UserRepository } from './user.repository'

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository
  ) {}

  @Post('/login')
  async login(@Body() body: LoginRequestDto) {
    const access_token = await this.authService.jwtLogin(body)

    return {
      access_token
    }
  }

  @Post('/signup')
  async signup(@Body() body) {
    await this.userRepository.saveUser(body.email, body.password, body.role)
  }
}
