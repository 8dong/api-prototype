import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne
} from 'typeorm'

import { CommonEntity } from 'src/common/entities/common.entity'
import { LinkEntity } from 'src/link/link.entity'
import { CategoryEntity } from '../category/category.entity'
import { UserEntity } from 'src/user/user.entity'

@Entity('message')
export class MessageEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: '255', nullable: false })
  content: string

  @IsDate()
  @Column({ type: 'timestamp', name: 'visible_to_at', nullable: true })
  visibleToAt: Date

  @IsDate()
  @Column({ type: 'timestamp', name: 'visible_from_at', nullable: true })
  visibleFromAt: Date

  @IsBoolean()
  @Column({ name: 'constantly_visible', type: 'boolean', nullable: false })
  constantlyVisible: boolean

  @CreateDateColumn({ name: 'created_at' })
  createAt: Date

  @OneToOne(() => LinkEntity, (linkEntity) => linkEntity.message, { cascade: true })
  @JoinColumn({ name: 'link_id' })
  link: LinkEntity

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.message, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToMany(() => CategoryEntity, (categoryEntity) => categoryEntity.message, { cascade: true })
  @JoinTable({
    name: 'message_category',
    joinColumn: {
      name: 'message_id'
    },
    inverseJoinColumn: {
      name: 'category_id'
    }
  })
  category: CategoryEntity[]
}
