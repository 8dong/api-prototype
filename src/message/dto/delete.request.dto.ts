import { PickType } from '@nestjs/mapped-types'

import { MessageEntity } from '../message.entity'

export class DeleteRequestDto extends PickType(MessageEntity, ['uuid']) {}
