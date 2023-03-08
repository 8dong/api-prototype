import { Injectable } from '@nestjs/common'

import { LinkRepository } from './link.repository'

@Injectable()
export class LinkService {
  constructor(private readonly linkRepository: LinkRepository) {}

  async getLink(uuid: string) {
    const linkData = await this.linkRepository.findOneByUUID(uuid)

    return linkData
  }
}
