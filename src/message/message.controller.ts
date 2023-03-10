import { Controller, Get, Post, Put, Req, Body, UseGuards, Delete } from '@nestjs/common'

import { CreateRequestDto } from './dto/create.request.dto'
import { UpdateRequestDto } from './dto/update.request.dto'
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard'
import { MessageService } from 'src/message/message.service'
import { DeleteRequestDto } from './dto/delete.request.dto'

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
  async updateMessage(@Body() body: UpdateRequestDto) {
    const messageConfig = body.message && { ...body.message }
    const linkConfig = body.link && { ...body.link }
    const categoryConfigList = body.category && [...body.category]

    await this.messageService.updateMessage(messageConfig, linkConfig, categoryConfigList)
  }

  @Delete()
  async deleteMessage(@Body() body: DeleteRequestDto) {
    await this.messageService.deleteMessage(body.uuid)
  }
}
