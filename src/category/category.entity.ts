import { Column, Entity, Tree, TreeChildren, TreeParent, JoinColumn, OneToMany } from 'typeorm'
import { IsNotEmpty, IsString, IsEnum } from 'class-validator'

import { CommonEntity } from 'src/common/entities/common.entity'
import { MessageCategoryEntity } from 'src/map/message-category/message_category.entity'

export enum CategoryType {
  'large' = 'large',
  'medium' = 'medium',
  'small' = 'small'
}

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

  @IsEnum(CategoryType)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: CategoryType, nullable: false })
  type: CategoryType

  @TreeChildren()
  children: CategoryEntity[]

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: CategoryEntity

  @OneToMany(() => MessageCategoryEntity, (messagCategoryEntity) => messagCategoryEntity.category, {
    cascade: true
  })
  categoryMessage: MessageCategoryEntity[]
}
