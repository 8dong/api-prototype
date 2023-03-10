import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

import { RawMessage } from './type/rawMessage'
import { MessageEntity } from './message.entity'
import { MessageCategoryEntity } from 'src/map/message-category/message_category.entity'
import { UserEntity } from 'src/user/user.entity'
import { LinkEntity } from 'src/link/link.entity'
import { plainToInstance } from 'class-transformer'
import { UpdateMessageRequestDto } from './dto/update.request.dto'

interface MessageConfigProps {
  content: string
  visibleToAt: Date
  visibleFromAt: Date
  constantlyVisible: boolean
  link: LinkEntity
  user: UserEntity
}

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity) private readonly messageEntity: Repository<MessageEntity>
  ) {}

  createMessageEntity(config: MessageConfigProps) {
    const uuid = v4()

    const messageEntity = new MessageEntity()
    messageEntity.uuid = uuid
    messageEntity.content = config.content
    messageEntity.visibleToAt = config.visibleToAt
    messageEntity.visibleFromAt = config.visibleFromAt
    messageEntity.constantlyVisible = config.constantlyVisible
    messageEntity.link = config.link
    messageEntity.user = config.user

    return messageEntity
  }

  async getRawManyByUserId(userId: number) {
    const messageEntityList = await this.messageEntity.find({
      relations: {
        user: true,
        link: true,
        messageCategory: {
          category: true
        }
      },
      where: [{ user: { id: userId } }]
    })

    return messageEntityList
  }

  async saveMessageEntity(message: MessageEntity) {
    await this.messageEntity.save(message)
  }

  async update(messageConfig: UpdateMessageRequestDto) {
    await this.messageEntity.update(
      { uuid: messageConfig.uuid },
      {
        ...messageConfig
      }
    )
  }

  async findOneByUniqueId(uuid: string) {
    const message = await this.messageEntity.findOneBy({ uuid })

    return message
  }
}
