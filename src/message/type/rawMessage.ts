import { CategoryType } from './../../category/category.entity'
import { Exclude, Expose } from 'class-transformer'

import { LinkType } from 'src/link/link.entity'

@Exclude()
export class RawMessage {
  @Expose()
  id: number

  @Expose()
  content: string

  @Expose()
  visibleToAt: Date

  @Expose()
  vislbleFromAt: Date

  @Expose()
  constantlyVisible: boolean

  @Expose()
  createAt: Date

  @Expose()
  linkHref: string

  @Expose()
  linkType: LinkType

  @Expose()
  smallCategoryId: number

  @Expose()
  category: { categoryType: CategoryType; categoryContent: string }[]
}
