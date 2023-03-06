import { Body, Controller, Post } from '@nestjs/common'

import { LoginRequestDto } from './../auth/dto/login.request.dto'
import { AuthService } from 'src/auth/auth.service'

@Controller('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginRequestDto) {
    const access_token = await this.authService.jwtLogin(body)

    return {
      access_token
    }
  }
}
