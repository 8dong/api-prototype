import { CategoryEntity } from './../category/category.entity'
import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateRequestDto } from './../user/dto/createMessage.request.dto'
import { UpdateRequestDto } from './dto/update.request.dto'
import { UserRepository } from 'src/user/user.repository'
import { CategoryRepository } from 'src/category/category.repository'
import { MessageRepository } from './message.repository'
import { LinkRepository } from 'src/link/link.repository'

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly linkRepository: LinkRepository
  ) {}

  async getMessagesByUserUniqueId(uuid: string) {
    const userEntity = await this.userRepository.findOneByUserUniqueId(uuid)
    const messageRawList = await this.messageRepository.getRawManyByUserId(userEntity.id)

    for (const messageRaw of messageRawList) {
      const categoryEntityList = await this.categoryRepository.getManyByMessageId(messageRaw.id)

      const categoryContentList = categoryEntityList.map((categoryEntity) => ({
        categoryType: categoryEntity.type,
        categoryContent: categoryEntity.content
      }))

      messageRaw.category = categoryContentList

      delete messageRaw.smallCategoryId
      delete messageRaw.id
    }

    return messageRawList
  }

  async createMessage(uuid: string, req: CreateRequestDto) {
    const newLinkEntity = this.linkRepository.createLinkEntity(req.linkHref, req.linkType)
    const userEntity = await this.userRepository.findOneByUserUniqueId(uuid)

    const largeCategoryEntity = await this.categoryRepository.findOneLargeCategoryEntityByContent(
      req.categoryContent.largeCategory
    )
    const mediumCategoryEntity = await this.categoryRepository.findOneMediumCategoryEntityByContent(
      largeCategoryEntity,
      req.categoryContent.mediumCategory
    )
    const smallCategoryEntity = await this.categoryRepository.findOneSmallCategoryEntityByContent(
      mediumCategoryEntity,
      req.categoryContent.smallCategory
    )
    if (!largeCategoryEntity || !mediumCategoryEntity || !smallCategoryEntity) {
      throw new BadRequestException('Check your request')
    }

    const messageConfig = {
      content: req.content,
      visibleToAt: req.visibleToAt,
      visibleFromAt: req.visibleFromAt,
      constantlyVisible: req.constantlyVisible,
      categoryList: [largeCategoryEntity, mediumCategoryEntity, smallCategoryEntity],
      link: newLinkEntity,
      user: userEntity
    }
    const newMessage = this.messageRepository.createMessageEntity(messageConfig)

    await this.linkRepository.saveLinkEntity(newLinkEntity)
    await this.messageRepository.saveMessageEntity(newMessage)

    return newMessage
  }

  async updateMessageByUserUniqueId(uuid: string, req: UpdateRequestDto) {
    const messageConfig = { ...req.messageConfig }
    const linkConfig = { ...req.linkConfig }

    const categoryEntityList = []

    for (const categoryConfig of req.categoryConfigList) {
      const categoryEntity = await this.categoryRepository.findOneByUniqueId(categoryConfig.uuid)
      categoryEntityList.push(categoryEntity)
    }

    await this.messageRepository.updateMessageEntity(messageConfig, categoryEntityList)
    await this.linkRepository.updateLinkEntity(linkConfig)
  }
}

// insert into category (uuid, content, parent_id, type) values('1', '식사', null, 'large'), ('2', '고기', 1, 'medium'), ('3', '삼겹', 2, 'small'), ('4', '분식', 1, 'medium'), ('5', '만두', 4, 'small'), ('6','떡볶이', 4, 'small'), ('7', '교통/차량', null, 'large'), ('8', '대리운전', 7, 'medium'), ('9', '일반', 7, 'small');

// insert into category_closure (ancestor_id, descendant_id) values(1, 2), (2, 3), (1, 4), (4, 5), (4, 6), (7, 8), (7, 9);
