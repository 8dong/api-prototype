import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm'

import { CommonEntity } from 'src/common/common.entity'
import { LinkEntity } from './../link/link.eneity'
import { CategoryEneity } from './../category/cateogory.entity'
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

  @OneToOne(() => LinkEntity, (linkEntity) => linkEntity.id)
  @JoinColumn({ name: 'link_id' })
  linkId: number

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.id)
  @JoinColumn({ name: 'user_id' })
  userId: number

  @ManyToMany(() => CategoryEneity)
  @JoinTable({ name: 'category_message' })
  categoryId: number
}
