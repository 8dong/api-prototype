import {
  UpdateCategoryRequestDto,
  UpdateMessageRequestDto
} from './../message/dto/update.request.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CategoryEntity } from './category.entity'
import { TreeRepository } from 'typeorm'

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntity: TreeRepository<CategoryEntity>
  ) {}

  async findOneLargeCategoryEntityByContent(content: string) {
    const largeCaegoryEntity = (await this.categoryEntity.findRoots()).find((category) => {
      return category.content === content
    })

    return largeCaegoryEntity
  }

  async findOneMediumCategoryEntityByContent(largeCategory: CategoryEntity, content: string) {
    const mediumCategoryEntity = (await this.categoryEntity.findDescendants(largeCategory)).find(
      (category) => category.content === content
    )

    return mediumCategoryEntity
  }

  async findOneSmallCategoryEntityByContent(mediumCategory: CategoryEntity, content: string) {
    const smallCategoryEntity = (await this.categoryEntity.findDescendants(mediumCategory)).find(
      (category) => category.content === content
    )

    return smallCategoryEntity
  }

  async findOneByUniqueId(uuid: string) {
    const category = await this.categoryEntity.findOneBy({ uuid })

    return category
  }

  async getManyByMessageId(id: number) {
    const categoryList = await this.categoryEntity
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.message', 'message')
      .where('message.id = :id', { id })
      .select('category')
      .getMany()

    return categoryList
  }
}
