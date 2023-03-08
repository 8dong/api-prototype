import { Column, Entity, Tree, TreeChildren, TreeParent, JoinColumn, OneToOne } from 'typeorm'
import { IsNotEmpty, IsString } from 'class-validator'

import { CommonEntity } from 'src/common/entities/common.entity'
import { MessageEntity } from 'src/message/message.entity'

@Entity('category')
@Tree('closure-table', {
  ancestorColumnName: () => 'ancestor_id',
  descendantColumnName: () => 'descendant_id'
})
export class CategoryEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  content: string

  @TreeChildren()
  children: CategoryEntity[]

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: CategoryEntity

  @OneToOne(() => MessageEntity, (messageEntity) => messageEntity.category)
  message: MessageEntity
}
