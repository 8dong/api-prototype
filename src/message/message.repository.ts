import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MessageEntity } from './message.entity'

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity) private readonly messageEntity: Repository<MessageEntity>
  ) {}

  async findMessageByUserId(userId: number) {
    const message = await this.messageEntity
      .createQueryBuilder('message')
      .where('message.user_id = :user_id', { user_id: userId })
      .getMany()

    return message
  }
}
