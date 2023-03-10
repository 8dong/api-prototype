import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from 'typeorm'

import { CommonEntity } from 'src/common/entities/common.entity'
import { LinkEntity } from 'src/link/link.entity'
import { UserEntity } from 'src/user/user.entity'
import { MessageCategoryEntity } from 'src/map/message-category/message_category.entity'

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

  @OneToOne(() => LinkEntity, (link) => link.message, { cascade: ['insert', 'update', 'remove'] })
  @JoinColumn({ name: 'link_id' })
  link: LinkEntity

  @ManyToOne(() => UserEntity, (user) => user.message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @OneToMany(() => MessageCategoryEntity, (messageCategory) => messageCategory.message, {
    cascade: ['insert', 'update', 'remove']
  })
  messageCategory: MessageCategoryEntity[]
}
