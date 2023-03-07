import { CategoryModule } from './category/category.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from './user/user.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserEntity } from './user/user.entity'
import { CategoryEneity } from './category/cateogory.entity'
import { LinkEntity } from './link/link.entity'
import { MessageEntity } from './message/message.entity'
import { AuthModule } from './auth/auth.module'
import { MessageModule } from './message/message.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT as unknown as number,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity, LinkEntity, CategoryEneity, MessageEntity],
      synchronize: true
    }),
    UserModule,
    AuthModule,
    MessageModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
