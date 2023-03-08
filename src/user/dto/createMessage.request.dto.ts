import { PickType } from '@nestjs/mapped-types'
import { IsString, IsObject, IsNotEmpty, IsEnum, IsNotEmptyObject } from 'class-validator'

import { MessageEntity } from './../../message/message.entity'
import { LinkType } from 'src/link/link.entity'
import { Type } from 'class-transformer'

class CategoryContentDto {
  @IsString()
  @IsNotEmpty()
  largeCategory: string

  @IsString()
  @IsNotEmpty()
  mediumCategory: string

  @IsString()
  @IsNotEmpty()
  smallCategory: string
}

export class CreateRequestDto extends PickType(MessageEntity, [
  'content',
  'visibleToAt',
  'visibleFromAt',
  'constantlyVisible'
] as const) {
  @IsString()
  @IsNotEmpty()
  linkHref: string

  @IsEnum(LinkType)
  @IsNotEmpty()
  linkType: LinkType

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => CategoryContentDto)
  categoryContent: CategoryContentDto
}
