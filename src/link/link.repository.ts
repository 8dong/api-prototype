import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

import { LinkType } from './link.entity'
import { LinkEntity } from './link.entity'
import { UpdateLinkRequestDto } from 'src/message/dto/update.request.dto'

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

  async update(linkConfig: UpdateLinkRequestDto) {
    await this.linkEntity.update({ uuid: linkConfig.uuid }, { ...linkConfig })
  }

  async deleteLinkByUniqueId(uuid: string) {
    await this.linkEntity.delete({ uuid })
  }
}
