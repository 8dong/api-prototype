import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { JwtPayloadType } from './jwt/jwtPayload.type'
import { UserRepository } from './../user/user.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async jwtLogin(email: string, password: string) {
    const user = await this.userRepository.findOneByUserEamil(email)
    if (!user) {
      throw new UnauthorizedException('Check your email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Check your email or password')
    }

    const jwtPayload: JwtPayloadType = { email, role: user.role, sub: user.uuid }
    const access_token = this.jwtService.sign(jwtPayload)

    return access_token
  }
}
