import { PickType } from '@nestjs/mapped-types'

import { UserEntity } from './../../user/user.entity'

export class LoginRequestDto extends PickType(UserEntity, ['email', 'password'] as const) {}
