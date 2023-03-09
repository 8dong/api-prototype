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

  async findLargeCategoryByContent(content: string) {
    const largeCaegory = (await this.categoryEntity.findRoots()).find((category) => {
      return category.content === content
    })

    return largeCaegory
  }

  async findMediumCategoryByContent(largeCategory: CategoryEntity, content: string) {
    const mediumCategory = (await this.categoryEntity.findDescendants(largeCategory)).find(
      (category) => category.content === content
    )

    return mediumCategory
  }

  async findSmallCategoryByContent(mediumCategory: CategoryEntity, content: string) {
    const smallCategory = (await this.categoryEntity.findDescendants(mediumCategory)).find(
      (category) => category.content === content
    )

    return smallCategory
  }

  async findAllCategoryByMessageId(id: number) {
    const categoryList = await this.categoryEntity
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.message', 'message')
      .where('message.id = :id', { id })
      .select('category')
      .getRawMany()

    return categoryList
  }
}
