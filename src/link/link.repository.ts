import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

import { LinkType } from './link.entity'
import { LinkEntity } from './link.entity'

@Injectable()
export class LinkRepository {
  constructor(@InjectRepository(LinkEntity) private readonly linkEntity: Repository<LinkEntity>) {}

  async findLinkByUUID(uuid: string) {
    const linkData = await this.linkEntity.findOneBy({ uuid })

    return linkData
  }

  async createLink(href: string, type: LinkType) {
    const uuid = v4()
    const newLink = await this.linkEntity.save({
      uuid,
      href,
      type
    })

    return newLink
  }
}
