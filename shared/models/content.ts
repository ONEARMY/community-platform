import type { Author, DBAuthor } from './author'
import type { Category, DBCategory } from './category'
import type { IDBDocSB, IDoc } from './document'
import type { Tag } from './tag'

export interface IDBContentDoc extends IDBDocSB {
  readonly author?: DBAuthor
  readonly comment_count?: number
  readonly category: DBCategory | null
  readonly category_id?: number
  readonly created_by: number | null
  readonly deleted: boolean | null
  readonly subscriber_count?: number
  readonly title: string
  readonly total_views?: number
  readonly previous_slugs: string[] | null
  readonly slug: string
  readonly tags: number[]
  readonly useful_count?: number
}

export interface IContentDoc extends IDoc {
  author: Author | null
  category: Category | null
  commentCount: number
  deleted: boolean
  title: string
  previousSlugs: string[]
  slug: string
  subscriberCount: number
  tags: Tag[]
  tagIds?: number[]
  totalViews: number
  usefulCount: number
}
