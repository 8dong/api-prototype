import { Injectable } from '@nestjs/common'

import { CreateRequestDto } from './../user/dto/createMessage.request.dto'
import { UserRepository } from 'src/user/user.repository'
import { CategoryRepository } from 'src/category/category.repository'
import { MessageRepository } from './message.repository'
import { LinkRepository } from 'src/link/link.repository'

@Injectable()
export class MessageService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly messageRepository: MessageRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly linkRepository: LinkRepository
  ) {}

  async getMessages(uuid: string) {
    const { id: userId } = await this.userRepository.findUserByUUID(uuid)
    const messages = await this.messageRepository.findMessagesByUserId(userId)

    for (const message of messages) {
      const ancestorCategoryList = await this.categoryRepository.findAllAncestorsByCategoryId(
        message.category_id
      )

      message.category_content = ancestorCategoryList.map((category) => category.content)

      delete message.category_id
    }

    return messages
  }

  async createMessage(userUUID: string, messageConfig: CreateRequestDto) {
    const newLink = await this.linkRepository.createLink(
      messageConfig.linkHref,
      messageConfig.linkType
    )

    const user = await this.userRepository.findUserByUUID(userUUID)

    const largeCategory = await this.categoryRepository.findLargeCategoryByContent(
      messageConfig.categoryContent.largeCategory
    )
    const mediumCategory = await this.categoryRepository.findMediumCategoryByContent(
      largeCategory,
      messageConfig.categoryContent.mediumCategory
    )
    const smallCategory = await this.categoryRepository.findSmallCategoryByContent(
      mediumCategory,
      messageConfig.categoryContent.smallCategory
    )

    const newMessage = await this.messageRepository.creaetMessage(
      messageConfig.content,
      messageConfig.visibleToAt,
      messageConfig.visibleFromAt,
      messageConfig.constantlyVisible,
      smallCategory,
      newLink,
      user
    )

    return newMessage
  }
}

// insert into category (uuid, content, parent_id) values('1', '식사', null), ('2', '고기', 1), ('3', '삼겹', 2), ('4', '분식', 1), ('5', '만두', 4), ('6','떡볶이', 4), ('7', '교통/차량', null), ('8', '대리운전', 7), ('9', '일반', 7);

// insert into category_closure (ancestor_id, descendant_id) values(1, 2), (2, 3), (1, 4), (4, 5), (4, 6), (7, 8), (7, 9);
