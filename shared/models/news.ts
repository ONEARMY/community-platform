import { Author } from './author'
import { Category } from './category'

import type { DBAuthor } from './author'
import type { DBCategory } from './category'
import type { IConvertedFileMeta } from './common'
import type { IContentDoc, IDBContentDoc } from './content'
import type { DBMedia, Image } from './media'
import type { SelectValue } from './other'
import type { Tag } from './tag'

export class DBNews implements IDBContentDoc {
  readonly id: number
  readonly created_at: Date
  readonly modified_at: Date | null
  readonly author?: DBAuthor
  readonly comment_count?: number
  readonly category: DBCategory | null
  readonly category_id?: number
  readonly created_by: number | null
  readonly deleted: boolean | null
  is_draft: boolean | null
  readonly subscriber_count?: number
  readonly title: string
  readonly total_views?: number
  readonly previous_slugs: string[]
  readonly slug: string
  readonly summary: string | null
  readonly tags: number[]
  readonly useful_count?: number
  readonly body: string
  readonly hero_image: DBMedia | null
}

export class News implements IContentDoc {
  id: number
  isDraft: boolean
  createdAt: Date
  modifiedAt: Date | null
  author: Author | null
  category: Category | null
  commentCount: number
  deleted: boolean
  title: string
  previousSlugs: string[]
  slug: string
  subscriberCount: number
  summary: string | null
  tags: Tag[]
  tagIds?: number[]
  totalViews: number
  usefulCount: number
  body: string
  heroImage: Image | null

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBNews, tags: Tag[], heroImage?: Image | null) {
    return new News({
      id: obj.id,
      author: obj.author ? Author.fromDB(obj.author) : null,
      body: obj.body,
      category: obj.category ? Category.fromDB(obj.category) : null,
      commentCount: obj.comment_count || 0,
      createdAt: new Date(obj.created_at),
      deleted: obj.deleted || false,
      isDraft: obj.is_draft || false,
      heroImage: heroImage || null,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      previousSlugs: obj.previous_slugs,
      slug: obj.slug,
      subscriberCount: obj.subscriber_count || 0,
      summary: obj.summary || null,
      tagIds: obj.tags,
      tags,
      title: obj.title,
      totalViews: obj.total_views || 0,
      usefulCount: obj.useful_count || 0,
    })
  }
}

export type NewsFormData = {
  body: string
  category: SelectValue | null
  existingHeroImage: Image | null
  heroImage: IConvertedFileMeta | null
  isDraft: boolean | null
  title: string
  tags?: number[]
}
