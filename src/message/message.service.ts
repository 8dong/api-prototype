import { Injectable } from '@nestjs/common'

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
    const { id } = await this.userRepository.findUserByUUID(uuid)
    const messages = await this.messageRepository.findMessagesByUserId(id)

    for (const message of messages) {
      message.category_content = await this.categoryRepository.findAllCategoryByCategoryId(
        message.category_id
      )
      delete message.category_id
    }

    return messages
  }
}
