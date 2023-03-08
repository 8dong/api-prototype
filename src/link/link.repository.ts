import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

import { LinkType } from './link.entity'
import { LinkEntity } from './link.entity'

@Injectable()
export class LinkRepository {
  constructor(@InjectRepository(LinkEntity) private readonly linkEntity: Repository<LinkEntity>) {}

  async findOneByUUID(uuid: string) {
    const linkData = await this.linkEntity.findOneBy({ uuid })

    return linkData
  }

  async create(href: string, type: LinkType) {
    const uuid = v4()

    const newLink = new LinkEntity()
    newLink.uuid = uuid
    newLink.href = href
    newLink.type = type

    return newLink
  }

  async save(link: LinkEntity) {
    await this.linkEntity.save(link)
  }
}
