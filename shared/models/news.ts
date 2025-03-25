import { Author } from './author'
import { Category, ContentDoc, DBContentDoc } from './document'

import type { IConvertedFileMeta } from './common'
import type { DBImage, Image } from './image'
import type { SelectValue } from './other'
import type { Tag } from './tag'

export class DBNews extends DBContentDoc {
  readonly body: string
  readonly hero_image: DBImage | null
}

export class News extends ContentDoc {
  body: string
  heroImage: Image | null

  static fromDB(obj: DBNews, tags: Tag[], heroImage?: Image) {
    return new News({
      author: obj.author ? Author.fromDB(obj.author) : null,
      body: obj.body,
      category: obj.category ? Category.fromDB(obj.category) : null,
      commentCount: obj.comment_count || 0,
      createdAt: new Date(obj.created_at),
      deleted: obj.deleted || false,
      heroImage: heroImage || null,
      id: obj.id,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      slug: obj.slug,
      subscriberCount: obj.subscriber_count || 0,
      tagIds: obj.tags,
      tags: tags,
      title: obj.title,
      totalViews: obj.total_views || 0,
      usefulCount: obj.useful_count || 0,
    })
  }
}

export type NewsFormData = {
  title: string
  body: string
  category: SelectValue | null
  tags?: number[]
  heroImage: IConvertedFileMeta | null
  existingHeroImage: Image | null
}
