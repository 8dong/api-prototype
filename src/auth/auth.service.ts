import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { LoginRequestDto } from './dto/login.request.dto'
import { JwtPaylodDto } from './dto/jwtPayload.dto'
import { UserRepository } from './../user/user.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async jwtLogin(loginReqeust: LoginRequestDto) {
    const { email, password } = loginReqeust

    const userData = await this.userRepository.findOneByUserEamil(email)
    if (!userData) {
      throw new UnauthorizedException('Check your email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Check your email or password')
    }

    const jwtPayload: JwtPaylodDto = { email, role: userData.role, sub: userData.uuid }
    const access_token = this.jwtService.sign(jwtPayload)

    return access_token
  }
}
