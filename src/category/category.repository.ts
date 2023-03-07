import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CategoryEneity } from './cateogory.entity'
import { TreeRepository } from 'typeorm'

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEneity)
    private readonly categoryEntity: TreeRepository<CategoryEneity>
  ) {}

  async findAllCategoryByCategoryId(categoryId: number) {
    let currentCategory = await this.categoryEntity.findOneBy({ id: categoryId })
    let currentAncestorNum = await this.categoryEntity.countAncestors(currentCategory)

    const result: string[] = []
    result.unshift(currentCategory.content)

    while (currentAncestorNum !== 0) {
      const ancestorCategory = (await this.categoryEntity.findAncestors(currentCategory))[0]
      const ancestorNum = await this.categoryEntity.countAncestors(ancestorCategory)

      if (!ancestorCategory) break
      result.unshift(ancestorCategory.content)

      currentAncestorNum = ancestorNum
      currentCategory = ancestorCategory
    }

    return result
  }
}
