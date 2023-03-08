import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

import { MessageEntity } from './message.entity'
import { UserEntity } from 'src/user/user.entity'
import { LinkEntity } from 'src/link/link.entity'
import { CategoryEntity } from './../category/cateogory.entity'

interface MessageConfigProps {
  content: string
  visibleToAt: Date
  visibleFromAt: Date
  constantlyVisible: boolean
  category: CategoryEntity
  link: LinkEntity
  user: UserEntity
}

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity) private readonly messageEntity: Repository<MessageEntity>
  ) {}

  async findAllByUserId(id: number) {
    const messages = await this.messageEntity
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.link', 'link')
      .leftJoinAndSelect('message.category', 'category')
      .where('message.user = :id', { id })
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

  create(config: MessageConfigProps) {
    const uuid = v4()

    const newMessage = new MessageEntity()
    newMessage.uuid = uuid
    newMessage.content = config.content
    newMessage.visibleToAt = config.visibleToAt
    newMessage.visibleFromAt = config.visibleFromAt
    newMessage.constantlyVisible = config.constantlyVisible
    newMessage.category = config.category
    newMessage.link = config.link
    newMessage.user = config.user

    return newMessage
  }

  async save(message: MessageEntity) {
    await this.messageEntity.save(message)
  }
}
