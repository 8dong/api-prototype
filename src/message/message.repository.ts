import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

import { RawMessage } from './type/rawMessage'
import { MessageEntity } from './message.entity'
import { UserEntity } from 'src/user/user.entity'
import { LinkEntity } from 'src/link/link.entity'
import { CategoryEntity } from '../category/category.entity'
import { plainToInstance } from 'class-transformer'

interface MessageConfigProps {
  content: string
  visibleToAt: Date
  visibleFromAt: Date
  constantlyVisible: boolean
  categoryList: CategoryEntity[]
  link: LinkEntity
  user: UserEntity
}

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity) private readonly messageEntity: Repository<MessageEntity>
  ) {}

  async getRawManyByUserId(userId: number) {
    const messageRawList = await this.messageEntity
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.link', 'link')
      .leftJoinAndSelect('message.category', 'category')
      .where('message.user = :userId', { userId })
      .andWhere('category.type = "small"')
      .select([
        'message.id as id',
        'message.content as content',
        'message.visibleToAt as visibleToAt',
        'message.visibleFromAt as visibleFromAt',
        'message.constantlyVisible as constantantlyVisible',
        'message.createAt as createAt',
        'link.href as linkHref',
        'link.type as linkType',
        'category.id as smallCategoryId'
      ])
      .getRawMany()

    return plainToInstance(RawMessage, messageRawList)
  }

  createMessageEntity(config: MessageConfigProps) {
    const uuid = v4()

    const newMessage = new MessageEntity()
    newMessage.uuid = uuid
    newMessage.content = config.content
    newMessage.visibleToAt = config.visibleToAt
    newMessage.visibleFromAt = config.visibleFromAt
    newMessage.constantlyVisible = config.constantlyVisible
    newMessage.category = config.categoryList
    newMessage.link = config.link
    newMessage.user = config.user

    return newMessage
  }

  async saveMessageEntity(message: MessageEntity) {
    await this.messageEntity.save(message)
  }

  async updateMessageEntity(messageConfig, categoryEntityList) {
    // console.log(messageConfig)
    // console.log(categoryEntityList)

    const message = await this.messageEntity
      .createQueryBuilder('message')
      .where('message.uuid = :uuid', { uuid: messageConfig.uuid })
      .update()
      .set({
        ...messageConfig
      })
      .insert()
      .values({
        category: () => categoryEntityList
      })
      .execute()

    console.log(message)
  }

  async findOneByUniqueId(uuid: string) {
    const message = await this.messageEntity.findOneBy({ uuid })

    return message
  }
}
