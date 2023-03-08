import { UserRepository } from './../../user/user.repository'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtPaylodDto } from '../dto/jwtPayload.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpires: false
    })
  }

  async validate(payload: JwtPaylodDto) {
    const { email } = payload

    const userData = await this.userRepository.findOneByUserEamil(email)

    if (!userData) {
      throw new UnauthorizedException('Invalid User credentials')
    }

    return { uuid: userData.uuid, role: userData.role }
  }
}
