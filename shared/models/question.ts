import { Author } from './author'
import { Category } from './category'

import type { DBAuthor } from './author'
import type { DBCategory } from './category'
import type { IConvertedFileMeta } from './common'
import type { DBImage, Image } from './image'
import type { Tag } from './tag'

export class DBQuestion {
  readonly id: number
  readonly created_at: string
  readonly deleted: boolean | null
  readonly author?: DBAuthor
  readonly useful_count?: number
  readonly subscriber_count?: number
  readonly comment_count?: number
  readonly total_views?: number
  readonly category: DBCategory | null
  created_by: number | null
  modified_at: string | null
  title: string
  slug: string
  description: string
  images: DBImage[] | null
  category_id?: number
  tags: number[]

  constructor(obj: Omit<DBQuestion, 'id'>) {
    Object.assign(this, obj)
  }
}

export class Question {
  id: number
  createdAt: Date
  author: Author | null
  modifiedAt: Date | null
  title: string
  slug: string
  description: string
  images: Image[] | null
  deleted: boolean
  usefulCount: number
  subscriberCount: number
  commentCount: number
  category: Category | null
  totalViews: number
  tags: Tag[]
  tagIds?: number[]

  constructor(obj: Question) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBQuestion, tags: Tag[], images?: Image[]) {
    return new Question({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      author: obj.author ? Author.fromDB(obj.author) : null,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      title: obj.title,
      slug: obj.slug,
      description: obj.description,
      images: images || [],
      deleted: obj.deleted || false,
      usefulCount: obj.useful_count || 0,
      subscriberCount: obj.subscriber_count || 0,
      commentCount: obj.comment_count || 0,
      category: obj.category ? Category.fromDB(obj.category) : null,
      totalViews: obj.total_views || 0,
      tagIds: obj.tags,
      tags: tags,
    })
  }
}

export type QuestionFormData = {
  title: string
  description: string
  category: SelectValue | null
  tags?: number[]
  images: IConvertedFileMeta[] | null
  existingImages: Image[] | null
}

export type SelectValue = { label: string; value: string }
