import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as bycrypt from 'bcrypt'

import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(UserEntity) private readonly userEntity: Repository<UserEntity>) {}

  async findOneByUserUniqueId(uuid: string) {
    const userEntity = await this.userEntity.findOneBy({ uuid })

    return userEntity
  }

  async findOneByUserEamil(email: string) {
    const userEntity = await this.userEntity.findOneBy({ email })

    return userEntity
  }

  async saveUser(email, password, role) {
    const hashedpassword = await bycrypt.hash(password, 10)

    await this.userEntity.save({ email, password: hashedpassword, role })
  }
}
