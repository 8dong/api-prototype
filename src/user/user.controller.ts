import { Body, Controller, Post, Get, Req, UseGuards, BadRequestException } from '@nestjs/common'

// import { UserRepository } from './user.repository'
import { CreateRequestDto } from './dto/createMessage.request.dto'
import { LoginRequestDto } from './../auth/dto/login.request.dto'
import { AuthService } from 'src/auth/auth.service'
import { MessageService } from 'src/message/message.service'
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard'

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService // private readonly userRepository: UserRepository
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
  async getUserMessages(@Req() req) {
    const messages = await this.messageService.getMessages(req.user.uuid)

    return { messages }
  }

  @Post('/message')
  @UseGuards(JwtAuthGuard)
  async createMessage(@Req() req, @Body() body: CreateRequestDto) {
    if (!body.constantlyVisible && (!body.visibleToAt || !body.visibleFromAt)) {
      throw new BadRequestException('Check your request')
    }

    const newMessage = await this.messageService.createMessage(req.user.uuid, body)

    return newMessage
  }

  // @Post('/signup')
  // async signup(@Body() body) {
  //   await this.userRepository.createUser(body.email, body.password, body.role)
  // }
}
