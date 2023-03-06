import { UserRepository } from 'src/user/user.repository'
import { Injectable } from '@nestjs/common'

import { MessageRepository } from './message.repository'

@Injectable()
export class MessageService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly messageRepository: MessageRepository
  ) {}

  async getMessage(uuid: string) {
    const { id } = await this.userRepository.findUserByUUID(uuid)

    const message = await this.messageRepository.findMessageByUserId(id)

    return message
  }
}
