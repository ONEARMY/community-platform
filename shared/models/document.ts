import type { Author, DBAuthor } from './author'
import type { ContentType } from './common'

export abstract class DBDocSB {
  readonly id: number
  readonly created_at: Date
  readonly modified_at: string | null

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}

export abstract class DBContentDoc extends DBDocSB {
  readonly author?: DBAuthor
  readonly comment_count?: number
  readonly category: DBCategory | null
  readonly category_id?: number
  readonly created_by: number | null
  readonly deleted: boolean | null
  readonly subscriber_count?: number
  readonly title: string
  readonly total_views?: number
  readonly previous_slugs: string[]
  readonly slug: string
  readonly tags: number[]
  readonly useful_count?: number
}

export abstract class Doc {
  id: number
  createdAt: Date
  modifiedAt: Date | null

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}

export class ContentDoc extends Doc {
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

export class Category extends Doc {
  name: string
  type: ContentType

  static fromDB(category: DBCategory) {
    const { created_at, id, name, type } = category
    return new Category({
      id,
      createdAt: new Date(created_at),
      name,
      type,
    })
  }
}

export class DBCategory extends DBDocSB {
  name: string
  type: ContentType

  static fromDB(category: DBCategory) {
    return new DBCategory(category)
  }
}

export class DBTag extends DBDocSB {
  name: string

  static toDB(tag: Tag) {
    const { createdAt, id, name } = tag
    return new DBTag({
      id,
      name,
      created_at: new Date(createdAt),
    })
  }
}

export class Tag extends Doc {
  name: string

  static fromDB(tag: DBTag) {
    const { created_at, id, name } = tag
    return new Tag({
      id,
      name,
      createdAt: new Date(created_at),
    })
  }
}
