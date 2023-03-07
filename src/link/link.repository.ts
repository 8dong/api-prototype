import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { LinkEntity } from './link.entity'

@Injectable()
export class LinkRepository {
  constructor(@InjectRepository(LinkEntity) private readonly linkEntity: Repository<LinkEntity>) {}

  async findLinkByUUID(uuid: string) {
    const linkData = await this.linkEntity.findOneBy({ uuid })

    return linkData
  }
}
