import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from './user/user.module'
import { MessageModule } from './message/message.module'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { LinkEntity } from './link/link.entity'
import { MessageEntity } from './message/message.entity'
import { CategoryEntity } from './category/category.entity'
import { UserEntity } from './user/user.entity'
import { MessageCategoryEntity } from './map/message-category/message_category.entity'
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
      entities: [UserEntity, LinkEntity, CategoryEntity, MessageEntity, MessageCategoryEntity],
      synchronize: true
    }),
    UserModule,
    AuthModule,
    MessageModule,
    CategoryModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
