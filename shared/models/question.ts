import { Author } from './author'
import { Category, ContentDoc, DBContentDoc } from './document'

import type { IConvertedFileMeta } from './common'
import type { Tag } from './document'
import type { DBImage, Image } from './image'
import type { SelectValue } from './other'

export class DBQuestion extends DBContentDoc {
  readonly description: string
  readonly images: DBImage[] | null
}

export class Question extends ContentDoc {
  description: string
  images: Image[] | null

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
