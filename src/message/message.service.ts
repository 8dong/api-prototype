import { CreateRequestDto } from './dto/create.request.dto'

import { Injectable } from '@nestjs/common'
import {
  UpdateCategoryRequestDto,
  UpdateLinkRequestDto,
  UpdateMessageRequestDto
} from './dto/update.request.dto'
import { CategoryEntity } from 'src/category/category.entity'
import { UserRepository } from 'src/user/user.repository'
import { CategoryRepository } from 'src/category/category.repository'
import { MessageRepository } from './message.repository'
import { MessageCategoryRepository } from 'src/map/message-category/message-category.repository'
import { LinkRepository } from 'src/link/link.repository'
import { MessageCategoryEntity } from 'src/map/message-category/message_category.entity'

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly linkRepository: LinkRepository,
    private readonly messageCategoryRepository: MessageCategoryRepository
  ) {}

  async createMessage(uuid: string, req: CreateRequestDto) {
    const linkEntity = this.linkRepository.createLinkEntity(req.link.href, req.link.type)
    const userEntity = await this.userRepository.findOneByUserUniqueId(uuid)
    const messageCategoryEntityList: MessageCategoryEntity[] = []

    const messageConfig = {
      content: req.content,
      visibleToAt: req.visibleToAt,
      visibleFromAt: req.visibleFromAt,
      constantlyVisible: req.constantlyVisible,
      link: linkEntity,
      user: userEntity
    }

    const messageEntity = this.messageRepository.createMessageEntity(messageConfig)

    for (const categoryUniqueId of req.category) {
      const categoryEntity = await this.categoryRepository.findOneByUniqueId(categoryUniqueId.uuid)

      const messageCategoryEntity = this.messageCategoryRepository.createMessageCategory(
        categoryEntity,
        messageEntity
      )

      messageCategoryEntityList.push(messageCategoryEntity)
    }

    messageEntity.messageCategory = messageCategoryEntityList

    await this.linkRepository.saveLinkEntity(linkEntity)
    await this.messageRepository.saveMessageEntity(messageEntity)
  }

  async getMessagesByUserUniqueId(uuid: string) {
    const result = []

    const userEntity = await this.userRepository.findOneByUserUniqueId(uuid)
    const messageEntityList = await this.messageRepository.getRawManyByUserId(userEntity.id)

    for (const messageEntity of messageEntityList) {
      const categoryResponse = []

      for (const messageCategoryEntity of messageEntity.messageCategory) {
        const categoryEntity = messageCategoryEntity.category
        const categoryType = categoryEntity.type
        const categoryContent = categoryEntity.content
        const categoryUniqueId = categoryEntity.uuid

        categoryResponse.push({
          uuid: categoryUniqueId,
          type: categoryType,
          content: categoryContent
        })
      }

      result.push({
        uuid: messageEntity.uuid,
        content: messageEntity.content,
        visibleToAt: messageEntity.visibleToAt,
        visibleFromAt: messageEntity.visibleFromAt,
        constantlyVisible: messageEntity.constantlyVisible,
        createAt: messageEntity.createAt,
        link: {
          uuid: messageEntity.link.uuid,
          href: messageEntity.link.href,
          type: messageEntity.link.type
        },
        category: [...categoryResponse]
      })
    }

    return result
  }

  async updateMessage(
    messageConfig: UpdateMessageRequestDto,
    linkConfig: UpdateLinkRequestDto,
    categoryConfigList: UpdateCategoryRequestDto[]
  ) {
    if (messageConfig) {
      await this.messageRepository.update(messageConfig)
    }

    if (linkConfig) {
      await this.linkRepository.update(linkConfig)
    }

    if (categoryConfigList) {
      const categoryEntityList: CategoryEntity[] = []
      if (categoryConfigList.length !== 0) {
        for (const categoryConfig of categoryConfigList) {
          const categoryEntity = await this.categoryRepository.findOneByUniqueId(
            categoryConfig.uuid
          )

          categoryEntityList.push(categoryEntity)
        }
        const messageEntity = await this.messageRepository.findOneByUniqueId(messageConfig.uuid)

        await this.messageCategoryRepository.update(categoryEntityList, messageEntity)
      }
    }
  }

  async deleteMessage(uuid: string) {
    const messageEntity = await this.messageRepository.findOneByUniqueId(uuid)

    const linkEntity = await this.linkRepository.findOneByUUID(messageEntity.link.uuid)

    await this.messageRepository.deleteMessageByUniqueId(uuid)
    await this.linkRepository.deleteLinkByUniqueId(linkEntity.uuid)
  }

  // insert into category (uuid, content, parent_id, type) values('1', '??????', null, 'large'), ('2', '??????', 1, 'medium'), ('3', '??????', 2, 'small'), ('4', '??????', 1, 'medium'), ('5', '??????', 4, 'small'), ('6','?????????', 4, 'small'), ('7', '??????/??????', null, 'large'), ('8', '????????????', 7, 'medium'), ('9', '??????', 7, 'small');

  // insert into category_closure (ancestor_id, descendant_id) values(1, 2), (2, 3), (1, 4), (4, 5), (4, 6), (7, 8), (7, 9)
}
