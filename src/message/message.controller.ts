import { Controller, Get, Post, Put, Req, Body, UseGuards } from '@nestjs/common'

import { CreateRequestDto } from './dto/create.request.dto'
import { UpdateRequestDto } from './dto/update.request.dto'
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard'
import { MessageService } from 'src/message/message.service'

@Controller('/message')
@UseGuards(JwtAuthGuard)
export class MessageContoller {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Req() req, @Body() body: CreateRequestDto) {
    const userUniqueId = req.user.uuid

    await this.messageService.createMessage(userUniqueId, body)
  }

  @Get()
  async getMessages(@Req() req) {
    const userUniqueId = req.user.id

    const messages = await this.messageService.getMessagesByUserUniqueId(userUniqueId)

    return { messages }
  }

  @Put()
  async updateMessage(@Req() req, @Body() body: UpdateRequestDto) {
    const messageConfig = { ...body.message }
    const linkConfig = { ...body.link }
    const categoryConfigList = [...body.category]

    await this.messageService.updateMessage(messageConfig, linkConfig, categoryConfigList)
  }
}
