import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

import { MessageEntity } from './message.entity'
import { UserRepository } from 'src/user/user.repository'
import { UserEntity } from 'src/user/user.entity'
import { LinkEntity } from 'src/link/link.entity'
import { CategoryEneity } from './../category/cateogory.entity'

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity) private readonly messageEntity: Repository<MessageEntity>,
    private readonly userRepository: UserRepository
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

  async creaetMessage(
    content: string,
    visibleToAt: Date,
    visibleFromAt: Date,
    constantlyVisible: boolean,
    cateogry: CategoryEneity,
    link: LinkEntity,
    user: UserEntity
  ) {
    const uuid = v4()

    const message = new MessageEntity()
    message.uuid = uuid
    message.content = content
    message.visibleToAt = visibleToAt
    message.visibleFromAt = visibleFromAt
    message.constantlyVisible = constantlyVisible
    message.category = cateogry
    message.link = link
    message.user = user

    return await this.messageEntity.save(message)
  }
}
