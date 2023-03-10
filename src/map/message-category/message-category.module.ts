import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { MessageCategoryEntity } from './message_category.entity'
import { MessageCategoryRepository } from './message-category.repository'

@Module({
  imports: [TypeOrmModule.forFeature([MessageCategoryEntity])],
  controllers: [],
  providers: [MessageCategoryRepository],
  exports: [MessageCategoryRepository]
})
export class MessageCategoryModule {}
