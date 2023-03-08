import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import v4 from 'uuid'

import { CategoryEneity } from './cateogory.entity'
import { TreeRepository } from 'typeorm'

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEneity)
    private readonly categoryEntity: TreeRepository<CategoryEneity>
  ) {}

  async findAllAncestorsByCategoryId(categoryId: number) {
    let currentCategory = await this.categoryEntity.findOneBy({ id: categoryId })
    let currentAncestorNum = await this.categoryEntity.countAncestors(currentCategory)

    const result: CategoryEneity[] = []
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

  async findMediumCategoryByContent(largeCategory: CategoryEneity, content: string) {
    const mediumCategory = (await this.categoryEntity.findDescendants(largeCategory)).find(
      (category) => category.content === content
    )

    return mediumCategory
  }

  async findSmallCategoryByContent(mediumCategory: CategoryEneity, content: string) {
    const smallCategory = (await this.categoryEntity.findDescendants(mediumCategory)).find(
      (category) => category.content === content
    )

    return smallCategory
  }
}
