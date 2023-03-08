import { IsString, IsNotEmpty } from 'class-validator'
import { PickType } from '@nestjs/mapped-types'

import { UserEntity } from 'src/user/user.entity'

export class JwtPaylodDto extends PickType(UserEntity, ['email', 'role'] as const) {
  @IsString()
  @IsNotEmpty()
  sub: string
}
