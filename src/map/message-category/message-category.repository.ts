import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MessageEntity } from 'src/message/message.entity'
import { CategoryEntity } from 'src/category/category.entity'
import { MessageCategoryEntity } from './message_category.entity'

@Injectable()
export class MessageCategoryRepository {
  constructor(
    @InjectRepository(MessageCategoryEntity)
    private readonly messageCategory: Repository<MessageCategoryEntity>
  ) {}

  createMessageCategory(CategoryEntity: CategoryEntity, MessageEntity: MessageEntity) {
    const messageCategoryEntity = new MessageCategoryEntity()

    messageCategoryEntity.category = CategoryEntity
    messageCategoryEntity.message = MessageEntity

    return messageCategoryEntity
  }

  async update(categoryEntityList: CategoryEntity[], messageEntity: MessageEntity) {
    await this.messageCategory.delete({ message: { id: messageEntity.id } })

    for (const categoryEntity of categoryEntityList) {
      await this.messageCategory
        .createQueryBuilder('messageCategory')
        .leftJoinAndSelect('messageCategory.message', 'message')
        .insert()
        .values({
          message: messageEntity,
          category: categoryEntity
        })
        .execute()
    }
  }
}
