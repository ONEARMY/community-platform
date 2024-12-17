import { Category, DBCategory } from './category.model'
import { DBImage, Image } from './image.model'
import { Tag } from './tag.model'

import type { DBTag } from './tag.model'

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
  readonly total_views?: number
  readonly category: DBCategory | null
  readonly tags_db: DBTag[]
  created_by: number | null
  modified_at: string | null
  title: string
  slug: string
  description: string
  images: DBImage[] | null
  category_id?: number
  tagIds: number[]

  constructor(obj: Omit<DBQuestion, 'id' | 'tags_db'>) {
    Object.assign(this, obj)
  }

  static toDB(obj: Question) {
    return new DBQuestion({
      created_at: obj.createdAt.toUTCString(),
      created_by: obj.createdBy?.id || null,
      modified_at: obj.modifiedAt ? obj.modifiedAt.toUTCString() : null,
      title: obj.title,
      slug: obj.slug,
      deleted: obj.deleted,
      description: obj.description,
      images: obj.images
        ? obj.images.map((image) => DBImage.toDB(image))
        : null,
      category: obj.category ? DBCategory.toDB(obj.category) : null,
      tagIds: obj.tags ? obj.tags.map((tag) => tag.id) : [],
    })
  }
}

export class Question {
  id: number
  createdAt: Date
  createdBy: QuestionAuthor | null
  modifiedAt: Date | null
  title: string
  slug: string
  description: string
  images: Image[] | null
  deleted: boolean
  usefulCount: number
  subscriberCount: number
  category: Category | null
  totalViews: number
  tags: Tag[] | null

  constructor(obj: Question) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBQuestion) {
    return new Question({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      createdBy: obj.author ? QuestionAuthor.fromDB(obj.author) : null,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      title: obj.title,
      slug: obj.slug,
      description: obj.description,
      images: obj.images
        ? obj.images.map((image) => Image.fromDB(image))
        : null,
      deleted: obj.deleted || false,
      usefulCount: obj.useful_count || 0,
      subscriberCount: obj.subscriber_count || 0,
      category: obj.category ? Category.fromDB(obj.category) : null,
      totalViews: obj.total_views || 0,
      tags: obj.tags_db ? obj.tags_db.map((tag) => Tag.fromDB(tag)) : null,
    })
  }
}

export type Reply = Omit<Question, 'replies'>
