import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryEntity } from './cateogory.entity'
import { CategoryRepository } from './category.repository'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [],
  providers: [CategoryRepository],
  exports: [CategoryRepository]
})
export class CategoryModule {}
