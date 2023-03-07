import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
// import * as bycrypt from 'bcrypt'

import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(UserEntity) private readonly userEntity: Repository<UserEntity>) {}

  async findUserByUUID(uuid: string) {
    const userData = await this.userEntity.findOneBy({ uuid })

    return userData
  }

  async findUserByEamil(email: string) {
    const userData = await this.userEntity.findOneBy({ email })

    return userData
  }

  // async createUser(email, password, role) {
  //   const hashedpassword = await bycrypt.hash(password, 10)

  //   await this.userEntity.save({ email, password: hashedpassword, role })
  // }
}
