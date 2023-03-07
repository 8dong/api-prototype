import { PickType } from '@nestjs/mapped-types'
import { IsString, IsNotEmpty, IsEnum } from 'class-validator'

import { MessageEntity } from './../../message/message.entity'
import { LinkType } from 'src/link/link.entity'

export class CreateRequestDto extends PickType(MessageEntity, [
  'content',
  'visibleToAt',
  'visibleFromAt',
  'constantlyVisible'
] as const) {
  @IsString()
  @IsNotEmpty()
  href: string

  @IsEnum(LinkType)
  @IsNotEmpty()
  type: LinkType
}
