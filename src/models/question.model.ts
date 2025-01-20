import { DBCategory } from 'oa-shared'

import type { IConvertedFileMeta } from 'oa-shared'
import type { SelectValue } from 'src/pages/common/Category/CategoriesSelectV2'
import type { DBImage, Image } from './image.model'
import type { Tag } from './tag.model'

export class DBQuestionAuthor {
  readonly id: number
  readonly firebase_auth_id: string
  readonly display_name: string
  readonly username: string
  readonly photo_url: string
  readonly country: string
  readonly is_verified: boolean
}

export class QuestionAuthor {
  id: number
  name: string
  username: string
  firebaseAuthId: string
  photoUrl: string
  country: string
  isVerified: boolean

  constructor(obj: QuestionAuthor) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBQuestionAuthor) {
    return new QuestionAuthor({
      id: obj.id,
      name: obj.display_name,
      username: obj.username,
      firebaseAuthId: obj.firebase_auth_id,
      photoUrl: obj.photo_url,
      isVerified: obj.is_verified,
      country: obj.country,
    })
  }
}

export class DBQuestion {
  readonly id: number
  readonly created_at: string
  readonly deleted: boolean | null
  readonly author?: DBQuestionAuthor
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
  author: QuestionAuthor | null
  modifiedAt: Date | null
  title: string
  slug: string
  description: string
  images: Image[] | null
  deleted: boolean
  usefulCount: number
  subscriberCount: number
  commentCount: number
  category: DBCategory | null
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
      author: obj.author ? QuestionAuthor.fromDB(obj.author) : null,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      title: obj.title,
      slug: obj.slug,
      description: obj.description,
      images: images || [],
      deleted: obj.deleted || false,
      usefulCount: obj.useful_count || 0,
      subscriberCount: obj.subscriber_count || 0,
      commentCount: obj.comment_count || 0,
      category: obj.category ? DBCategory.fromDB(obj.category) : null,
      totalViews: obj.total_views || 0,
      tagIds: obj.tags,
      tags: tags,
    })
  }
}

export type Reply = Omit<Question, 'replies'>

export type QuestionFormData = {
  title: string
  description: string
  category: SelectValue | null
  tags?: number[]
  images: IConvertedFileMeta[] | null
  existingImages: Image[] | null
}
