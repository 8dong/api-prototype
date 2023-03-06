import { Entity, Column } from 'typeorm'
import { IsString, IsNotEmpty, IsEnum } from 'class-validator'

import { CommonEntity } from 'src/common/common.entity'

enum LinkType {
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
}
