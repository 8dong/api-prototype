import { Controller, Get, Post, Req, Body, UseGuards, BadRequestException } from '@nestjs/common'

import { CreateRequestDto } from './dto/create.request.dto'
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard'
import { MessageService } from 'src/message/message.service'

@Controller('/message')
export class MessageContoller {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMessages(@Req() req) {
    const userUniqueId = req.user.id

    const messages = await this.messageService.getMessagesByUserUniqueId(userUniqueId)

    return { messages }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMessage(@Req() req, @Body() body: CreateRequestDto) {
    if (!body.constantlyVisible && (!body.visibleToAt || !body.visibleFromAt)) {
      throw new BadRequestException('Check your request')
    }

    const userUniqueId = req.user.uuid

    const newMessage = await this.messageService.createMessage(userUniqueId, body)

    return { newMessage }
  }
}
