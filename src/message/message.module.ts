import { LinkModule } from 'src/link/link.module'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MessageEntity } from './message.entity'
import { MessageService } from './message.service'
import { MessageRepository } from './message.repository'
import { UserModule } from 'src/user/user.module'
import { CategoryModule } from 'src/category/category.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => UserModule),
    CategoryModule,
    LinkModule,
    forwardRef(() => UserModule)
  ],
  controllers: [],
  providers: [MessageService, MessageRepository],
  exports: [MessageService, MessageRepository]
})
export class MessageModule {}
