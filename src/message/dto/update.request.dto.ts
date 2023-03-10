import { PartialType, PickType } from '@nestjs/mapped-types'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { MessageEntity } from '../message.entity'
import { LinkEntity } from 'src/link/link.entity'
import { CategoryEntity } from 'src/category/category.entity'

export class UpdateLinkRequestDto extends PickType(PartialType(LinkEntity), [
  'uuid',
  'href',
  'type'
]) {}

export class UpdateCategoryRequestDto extends PickType(PartialType(CategoryEntity), ['uuid']) {}

export class UpdateMessageRequestDto extends PickType(PartialType(MessageEntity), [
  'uuid',
  'content',
  'visibleToAt',
  'visibleFromAt',
  'constantlyVisible'
]) {}

export class UpdateRequestDto {
  @IsObject()
  @Type(() => UpdateMessageRequestDto)
  message?: UpdateMessageRequestDto

  @IsObject()
  @Type(() => UpdateLinkRequestDto)
  link?: UpdateLinkRequestDto

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @Type(() => UpdateLinkRequestDto)
  category?: UpdateCategoryRequestDto[]
}
