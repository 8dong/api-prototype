import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { LinkService } from './link.service'
import { LinkRepository } from './link.repository'
import { LinkEntity } from './link.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity])],
  controllers: [],
  providers: [LinkService, LinkRepository],
  exports: [LinkRepository]
})
export class LinkModule {}
