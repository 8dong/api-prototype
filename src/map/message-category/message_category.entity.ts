import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CategoryEntity } from 'src/category/category.entity'
import { MessageEntity } from 'src/message/message.entity'

@Entity('message_category')
export class MessageCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => MessageEntity, (messageEntity) => messageEntity.messageCategory)
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity

  @ManyToOne(() => CategoryEntity, (categoryEntity) => categoryEntity.categoryMessage)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity
}
