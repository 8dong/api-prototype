import { CategoryEntity } from './../../category/cateogory.entity'
import { PickType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsString, IsObject, IsNotEmpty, IsEnum, IsNotEmptyObject } from 'class-validator'

import { MessageEntity } from './../../message/message.entity'
import { LinkType } from 'src/link/link.entity'

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

export type MessageConfigType = {
  linkHref: string
  linkType: LinkType
  categoryContent: {
    largeCategory: string
    mediumCategory: string
    smallCategory: string
  }
}
