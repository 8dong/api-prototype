import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateRequestDto } from './../user/dto/createMessage.request.dto'
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
    const { id: userId } = await this.userRepository.findOneByUserUniqueId(uuid)
    const messages = await this.messageRepository.findAllByUserId(userId)

    for (const message of messages) {
      const categoryList = await this.categoryRepository.findAllCategoryByMessageId(
        message.message_id
      )

      const categoryContentList = categoryList.map((category) => ({
        categoryType: category.category_type,
        categoryContent: category.category_content
      }))

      message.category = categoryContentList

      delete message.category_id
    }

    return messages
  }

  async createMessage(id: string, req: CreateRequestDto) {
    const newLink = await this.linkRepository.create(req.linkHref, req.linkType)

    const user = await this.userRepository.findOneByUserUniqueId(id)

    const largeCategory = await this.categoryRepository.findLargeCategoryByContent(
      req.categoryContent.largeCategory
    )
    const mediumCategory = await this.categoryRepository.findMediumCategoryByContent(
      largeCategory,
      req.categoryContent.mediumCategory
    )
    const smallCategory = await this.categoryRepository.findSmallCategoryByContent(
      mediumCategory,
      req.categoryContent.smallCategory
    )

    if (!largeCategory || !mediumCategory || !smallCategory) {
      throw new BadRequestException('Check your request')
    }

    const messageConfig = {
      content: req.content,
      visibleToAt: req.visibleToAt,
      visibleFromAt: req.visibleFromAt,
      constantlyVisible: req.constantlyVisible,
      categoryList: [largeCategory, mediumCategory, smallCategory],
      link: newLink,
      user: user
    }

    const newMessage = this.messageRepository.create(messageConfig)
    await this.linkRepository.save(newLink)
    await this.messageRepository.save(newMessage)

    return newMessage
  }
}

// insert into category (uuid, content, parent_id, type) values('1', '식사', null, 'large'), ('2', '고기', 1, 'medium'), ('3', '삼겹', 2, 'small'), ('4', '분식', 1, 'medium'), ('5', '만두', 4, 'small'), ('6','떡볶이', 4, 'small'), ('7', '교통/차량', null, 'large'), ('8', '대리운전', 7, 'medium'), ('9', '일반', 7, 'small');

// insert into category_closure (ancestor_id, descendant_id) values(1, 2), (2, 3), (1, 4), (4, 5), (4, 6), (7, 8), (7, 9);
