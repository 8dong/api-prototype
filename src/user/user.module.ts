import { UserController } from './user.controller'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './../auth/auth.module'
import { UserEntity } from './user.entity'
import { UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserRepository],
  exports: [UserRepository]
})
export class UserModule {}
