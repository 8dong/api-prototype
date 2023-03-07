import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MessageEntity } from './message.entity'

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity) private readonly messageEntity: Repository<MessageEntity>
  ) {}

  async findMessagesByUserId(userId: number) {
    const messages = await this.messageEntity
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.link', 'link')
      .leftJoinAndSelect('message.category', 'category')
      .where('message.user = :user', { user: userId })
      .select([
        'message.content',
        'message.visibleToAt',
        'message.visibleFromAt',
        'message.constantlyVisible',
        'message.createAt',
        'link.href',
        'link.type',
        'category.id'
      ])
      .getRawMany()

    return messages
  }
}
