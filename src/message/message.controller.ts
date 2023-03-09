import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Body,
  UseGuards,
  BadRequestException
} from '@nestjs/common'

import { CreateRequestDto } from './dto/create.request.dto'
import { UpdateRequestDto } from './dto/update.request.dto'
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard'
import { MessageService } from 'src/message/message.service'

@Controller('/message')
@UseGuards(JwtAuthGuard)
export class MessageContoller {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessages(@Req() req) {
    const userUniqueId = req.user.id

    const messages = await this.messageService.getMessagesByUserUniqueId(userUniqueId)

    return { messages }
  }

  @Post()
  async createMessage(@Req() req, @Body() body: CreateRequestDto) {
    this.isValidDuration(body.constantlyVisible, body.visibleToAt, body.visibleFromAt)

    const userUniqueId = req.user.uuid

    await this.messageService.createMessage(userUniqueId, body)
  }

  isValidDuration(constantlyVisible: boolean, visibleToAt: Date, visibleFromAt: Date) {
    if (!constantlyVisible && (!visibleToAt || !visibleFromAt)) {
      throw new BadRequestException('Check your request')
    } else if (constantlyVisible && (visibleToAt || visibleFromAt)) {
      throw new BadRequestException('Check your request')
    }

    return true
  }

  @Put()
  async updateMessage(@Req() req, @Body() body: UpdateRequestDto) {
    this.isValidDuration(
      body.messageConfig.constantlyVisible,
      body.messageConfig.visibleToAt,
      body.messageConfig.visibleFromAt
    )

    const userUniqueId = req.user.uuid

    await this.messageService.updateMessageByUserUniqueId(userUniqueId, body)
  }
}
