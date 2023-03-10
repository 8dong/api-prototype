import { LinkModule } from 'src/link/link.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryModule } from 'src/category/category.module'
import { UserModule } from 'src/user/user.module'
import { MessageEntity } from './message.entity'
import { MessageContoller } from './message.controller'
import { MessageService } from './message.service'
import { MessageRepository } from './message.repository'
import { MessageCategoryModule } from 'src/map/message-category/message-category.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    UserModule,
    CategoryModule,
    LinkModule,
    MessageCategoryModule
  ],
  controllers: [MessageContoller],
  providers: [MessageService, MessageRepository],
  exports: [MessageService, MessageRepository]
})
export class MessageModule {}
