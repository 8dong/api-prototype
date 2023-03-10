import { PickType } from '@nestjs/mapped-types'
import {
  IsObject,
  IsArray,
  IsInstance,
  ValidateNested,
  ArrayMaxSize,
  IsNotEmptyObject,
  ArrayMinSize,
  ArrayNotEmpty
} from 'class-validator'
import { Type } from 'class-transformer'

import { MessageEntity } from './../../message/message.entity'
import { LinkEntity } from 'src/link/link.entity'
import { CategoryEntity } from 'src/category/category.entity'

class CreateRequestLinkDto extends PickType(LinkEntity, ['href', 'type']) {}

class CreateRequestCategoryDto extends PickType(CategoryEntity, ['uuid']) {}

export class CreateRequestDto extends PickType(MessageEntity, [
  'content',
  'visibleToAt',
  'visibleFromAt',
  'constantlyVisible'
] as const) {
  @IsObject()
  @IsNotEmptyObject()
  @IsInstance(CreateRequestLinkDto)
  link: CreateRequestLinkDto

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => CreateRequestCategoryDto)
  category: CreateRequestCategoryDto[]
}
