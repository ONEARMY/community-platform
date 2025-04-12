import type { Author, DBAuthor } from './author'
import type { ContentType } from './common'

// Base level for all content on supabase
export interface DBDocSB {
  readonly id: number
  readonly created_at: Date
  readonly modified_at: Date | null
}

export interface Doc {
  id: number
  createdAt: Date
  modifiedAt: Date | null
}

// Second level for main content on supabase
export interface DBContentDoc extends DBDocSB {
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

export interface ContentDoc extends Doc {
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

// All main content types can have a category
export class DBCategory implements DBDocSB {
  id: number
  created_at: Date
  modified_at: Date | null

  name: string
  type: ContentType

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static toDB(category: Category) {
    const { createdAt, id, modifiedAt, name, type } = category
    return new DBCategory({
      id,
      created_at: new Date(createdAt),
      modified_at: modifiedAt ? new Date(modifiedAt) : null,
      name,
      type,
    })
  }
}

export class Category implements Doc {
  id: number
  createdAt: Date
  modifiedAt: Date | null

  name: string
  type: ContentType

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static fromDB(category: DBCategory) {
    const { created_at, id, modified_at, name, type } = category
    return new Category({
      id,
      createdAt: new Date(created_at),
      modifiedAt: modified_at ? new Date(modified_at) : null,
      name,
      type,
    })
  }
}

// All main content types can have tags
// Should be the same as Category minus the type field
export class DBTag implements DBDocSB {
  id: number
  created_at: Date
  modified_at: Date | null

  name: string

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static toDB(tag: Tag) {
    const { createdAt, id, modifiedAt, name } = tag
    return new DBTag({
      id,
      created_at: new Date(createdAt),
      modified_at: modifiedAt ? new Date(modifiedAt) : null,
      name,
    })
  }
}

export class Tag implements Doc {
  id: number
  createdAt: Date
  modifiedAt: Date | null

  name: string

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static fromDB(tag: DBTag) {
    const { created_at, id, modified_at, name } = tag
    return new Tag({
      id,
      createdAt: new Date(created_at),
      modified_at: modified_at ? new Date(modified_at) : null,
      name,
    })
  }
}
