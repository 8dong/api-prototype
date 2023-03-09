import { RoleType } from 'src/user/user.entity'

export interface JwtPayloadType {
  email: string
  role: RoleType
  sub: string
}
