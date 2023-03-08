import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CategoryEntity } from './cateogory.entity'
import { TreeRepository } from 'typeorm'

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntity: TreeRepository<CategoryEntity>
  ) {}

  async findAllAncestorsByCategoryId(categoryId: number) {
    let currentCategory = await this.categoryEntity.findOneBy({ id: categoryId })
    let currentAncestorNum = await this.categoryEntity.countAncestors(currentCategory)

    const result: CategoryEntity[] = []
    result.unshift(currentCategory)

    while (currentAncestorNum !== 0) {
      const ancestorCategory = (await this.categoryEntity.findAncestors(currentCategory))[0]
      const ancestorNum = await this.categoryEntity.countAncestors(ancestorCategory)

      if (!ancestorCategory) break
      result.unshift(ancestorCategory)

      currentAncestorNum = ancestorNum
      currentCategory = ancestorCategory
    }

    return result
  }

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
}
