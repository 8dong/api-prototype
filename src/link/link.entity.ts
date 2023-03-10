import { MessageEntity } from './../message/message.entity'
import { Entity, Column, OneToOne } from 'typeorm'
import { IsString, IsNotEmpty, IsEnum } from 'class-validator'

import { CommonEntity } from 'src/common/entities/common.entity'

export enum LinkType {
  'external' = 'external',
  'deeplink' = 'deeplink'
}

@Entity('link')
export class LinkEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  href: string

  @IsEnum(LinkType)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: LinkType, nullable: false })
  type: LinkType

  @OneToOne(() => MessageEntity, (messageEntity) => messageEntity.link, { onDelete: 'CASCADE' })
  message: MessageEntity
}
