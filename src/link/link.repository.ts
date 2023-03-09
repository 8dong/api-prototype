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

  createLinkEntity(href: string, type: LinkType) {
    const uuid = v4()

    const newLinkEntity = new LinkEntity()
    newLinkEntity.uuid = uuid
    newLinkEntity.href = href
    newLinkEntity.type = type

    return newLinkEntity
  }

  async saveLinkEntity(link: LinkEntity) {
    await this.linkEntity.save(link)
  }

  async updateLinkEntity(linkConfig) {
    await this.linkEntity
      .createQueryBuilder('link')
      .where('link.uuid = :uuid', { uuid: linkConfig.uuid })
      .update()
      .set({ ...linkConfig })
      .execute()
  }
}
