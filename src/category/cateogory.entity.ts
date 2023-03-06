import { Column, Entity, Tree, TreeChildren, TreeParent, JoinColumn } from 'typeorm'
import { IsNotEmpty, IsString } from 'class-validator'

import { CommonEntity } from 'src/common/common.entity'

@Entity('category')
@Tree('closure-table', {
  ancestorColumnName: () => 'ancestor_id',
  descendantColumnName: () => 'descendant_id'
})
export class CategoryEneity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  content: string

  @TreeChildren()
  children: CategoryEneity[]

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: CategoryEneity
}
