import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryEneity } from './cateogory.entity'
import { CategoryRepository } from './category.repository'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEneity])],
  controllers: [],
  providers: [CategoryRepository],
  exports: [CategoryRepository]
})
export class CategoryModule {}
