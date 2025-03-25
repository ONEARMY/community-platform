// eslint-disable-next-line simple-import-sort/imports
import { Author, Category, ResearchUpdateStatus } from 'oa-shared'

import type {
  DBCategory,
  IConvertedFileMeta,
  ResearchStatus,
  DBAuthor,
} from 'oa-shared'
import type { SelectValue } from 'src/pages/common/Category/CategoriesSelectV2'
import type { DBMedia, Media } from './image.model'
import type { Tag } from './tag.model'

export class DBResearchItem {
  readonly id: number
  readonly created_at: string
  readonly deleted: boolean | null
  readonly author?: DBAuthor
  readonly update_count?: number
  readonly useful_count?: number
  readonly subscriber_count?: number
  readonly comment_count?: number
  readonly total_views?: number
  readonly category: DBCategory | null
  readonly collaboratorsMapped: DBAuthor[]
  readonly updates: DBResearchUpdate[]
  created_by: number | null
  modified_at: string | null
  title: string
  slug: string
  previous_slugs: string[] | null
  description: string
  images: DBMedia[] | null
  category_id?: number
  tags: number[]
  status: ResearchStatus
  collaborators: number[] | null

  constructor(obj: Omit<DBResearchItem, 'id'>) {
    Object.assign(this, obj)
  }
}

export class ResearchItem {
  id: number
  createdAt: Date
  author: Author | null
  modifiedAt: Date | null
  title: string
  slug: string
  description: string
  images: Media[] | null
  deleted: boolean
  usefulCount: number
  subscriberCount: number
  commentCount: number
  updateCount: number
  category: Category | null
  totalViews: number
  tags: Tag[]
  tagIds?: number[]
  status: ResearchStatus
  collaborators: Author[]
  updates: ResearchUpdate[]

  constructor(obj: ResearchItem) {
    Object.assign(this, obj)
  }

  static fromDB(
    obj: DBResearchItem,
    tags: Tag[],
    images?: Media[],
    currentUserId?: number,
  ) {
    return new ResearchItem({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      author: obj.author ? Author.fromDB(obj.author) : null,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      title: obj.title,
      slug: obj.slug,
      description: obj.description,
      images: images || [],
      deleted: obj.deleted || false,
      category: obj.category ? Category.fromDB(obj.category) : null,
      totalViews: obj.total_views || 0,
      tagIds: obj.tags,
      tags: tags,
      status: obj.status,
      updateCount: obj.update_count || 0,
      subscriberCount: obj.subscriber_count || 0,
      commentCount: calculateUpdateCommentCount(obj),
      usefulCount: obj.useful_count || 0,
      collaborators:
        obj.collaboratorsMapped?.map((x) => Author.fromDB(x)) || [],
      // never show deleted updates; only show draft updates if current user is the author or collaborator
      updates:
        obj.updates
          ?.filter(
            (x) =>
              x.deleted !== true &&
              (x.status !== ResearchUpdateStatus.DRAFT ||
                (!!currentUserId &&
                  (obj.author?.id === currentUserId ||
                    obj.collaborators?.includes(currentUserId)))),
          )
          ?.map((x) => ResearchUpdate.fromDB(x)) || [],
    })
  }
}

export type Reply = Omit<ResearchItem, 'replies'>

export type ResearchFormData = {
  title: string
  description: string
  category?: SelectValue
  tags?: number[]
  collaborators?: number[]
  status: ResearchStatus
}

export type ResearchUpdateFormData = {
  title: string
  description: string
  images?: IConvertedFileMeta[]
  existingImages?: Media[]
  files?: IConvertedFileMeta[]
  existingFiles?: Media[]
  fileLink?: string
  videoUrl?: string
}

export class DBResearchUpdate {
  readonly id: number
  readonly research_id: number
  readonly created_at: string
  readonly deleted: boolean | null
  readonly is_draft: boolean | null
  readonly comment_count?: number
  readonly author?: DBAuthor
  created_by: number | null
  modified_at: string | null
  title: string
  description: string
  images: DBMedia[] | null
  files: DBMedia[] | null
  file_link: string | null
  video_url: string | null
  status: ResearchUpdateStatus

  constructor(obj: Omit<DBResearchItem, 'id'>) {
    Object.assign(this, obj)
  }
}

export class ResearchUpdate {
  id: number
  createdAt: Date
  author: Author | null
  modifiedAt: Date | null
  title: string
  description: string
  images: Media[] | null
  files: Media[] | null
  fileLink: string | null
  videoUrl: string | null
  deleted: boolean
  commentCount: number
  status: ResearchUpdateStatus

  constructor(obj: ResearchUpdate) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBResearchUpdate, images?: Media[], files?: Media[]) {
    return new ResearchUpdate({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      author: obj.author ? Author.fromDB(obj.author) : null,
      title: obj.title,
      description: obj.description,
      images: images || [],
      files: files || [],
      fileLink: obj.file_link,
      videoUrl: obj.video_url,
      deleted: obj.deleted || false,
      commentCount: obj.comment_count || 0,
      status: obj.status,
    })
  }
}

function calculateUpdateCommentCount(research: DBResearchItem): number {
  if (research.comment_count) {
    return research.comment_count
  }

  return research.updates
    ?.filter((x) => x.deleted !== true && x.is_draft !== true)
    .reduce((acc, x) => acc + (x.comment_count || 0), 0)
}
