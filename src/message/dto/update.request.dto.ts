import { PickType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsObject, IsNotEmptyObject, IsArray } from 'class-validator'

import { LinkEntity } from 'src/link/link.entity'
import { MessageEntity } from '../message.entity'
import { CategoryEntity } from 'src/category/category.entity'

class MessageConfigDto extends PickType(MessageEntity, [
  'uuid',
  'content',
  'visibleToAt',
  'visibleFromAt',
  'constantlyVisible'
]) {}

class LinkConfigDto extends PickType(LinkEntity, ['uuid', 'href', 'type']) {}

class CategoryConfig extends PickType(CategoryEntity, ['uuid']) {}

export class UpdateRequestDto {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => MessageConfigDto)
  messageConfig: MessageConfigDto

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => LinkConfigDto)
  linkConfig: LinkConfigDto

  @IsArray()
  @IsNotEmptyObject()
  @Type(() => CategoryConfig)
  categoryConfigList: CategoryConfig[]
}
