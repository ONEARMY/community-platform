import { Author } from './author'
import { Category } from './category'

import type { DBAuthor } from './author'
import type { DBCategory } from './category'
import type { IConvertedFileMeta } from './common'
import type { IContentDoc, IDBContentDoc } from './content'
import type { IDBDocSB, IDBDownloadable, IDoc, IDownloadable } from './document'
import type { IFilesForm } from './filesForm'
import type { DBMedia, Image, IMediaFile, MediaFile } from './media'
import type { SelectValue } from './other'
import type { Tag } from './tag'

export type ResearchStatus = 'in-progress' | 'complete'
export const ResearchStatusRecord: Record<ResearchStatus, string> = {
  'in-progress': 'In Progress',
  complete: 'Completed',
}

export class DBResearchItem implements IDBContentDoc {
  readonly id: number
  readonly created_at: Date
  readonly deleted: boolean | null
  readonly author?: DBAuthor
  readonly update_count?: number
  readonly useful_count?: number
  readonly subscriber_count?: number
  readonly comment_count?: number
  readonly total_views?: number
  readonly category: DBCategory | null
  readonly updates: DBResearchUpdate[]
  created_by: number | null
  modified_at: Date | null
  title: string
  slug: string
  previous_slugs: string[] | null
  description: string
  image: DBMedia | null
  category_id?: number
  tags: number[]
  status: ResearchStatus
  is_draft: boolean
  collaborators: string[] | null

  constructor(obj: Omit<DBResearchItem, 'id'>) {
    Object.assign(this, obj)
  }
}

export class ResearchItem implements IContentDoc {
  id: number
  createdAt: Date
  author: Author | null
  modifiedAt: Date | null
  title: string
  slug: string
  previousSlugs: string[]
  description: string
  image: Image | null
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
  collaboratorsUsernames: string[] | null
  updates: ResearchUpdate[]
  isDraft: boolean

  constructor(obj: ResearchItem) {
    Object.assign(this, obj)
  }

  static fromDB(
    obj: DBResearchItem,
    tags: Tag[],
    images: Image[] = [],
    collaborators: Author[] = [],
    currentUsername?: string,
  ) {
    const filteredUpdates = obj.updates?.filter((update) => {
      if (update.deleted) {
        return false
      }

      if (!update.is_draft) {
        return true
      }

      if (!currentUsername) {
        return false
      }

      const isAuthor = obj.author?.username === currentUsername
      const isCollaborator = (obj.collaborators || []).includes(currentUsername)

      return isAuthor || isCollaborator
    })

    const processedUpdates =
      filteredUpdates
        ?.map((update) => ResearchUpdate.fromDB(update, images))
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ) || []

    return new ResearchItem({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      author: obj.author ? Author.fromDB(obj.author) : null,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      title: obj.title,
      slug: obj.slug,
      previousSlugs: obj.previous_slugs || [],
      description: obj.description,
      image: images?.find((x) => x.id === obj.image?.id) || null,
      deleted: obj.deleted || false,
      category: obj.category ? Category.fromDB(obj.category) : null,
      totalViews: obj.total_views || 0,
      tagIds: obj.tags?.map((x) => Number(x)),
      tags: tags,
      status: obj.status,
      updateCount: obj.update_count || obj.updates?.length || 0,
      subscriberCount: obj.subscriber_count || 0,
      commentCount: calculateUpdateCommentCount(obj),
      usefulCount: obj.useful_count || 0,
      isDraft: obj.is_draft || false,
      collaboratorsUsernames: obj.collaborators,
      collaborators: collaborators || [],
      // never show deleted updates; only show draft updates if current user is the author or collaborator
      updates: processedUpdates,
    })
  }
}

export class DBResearchUpdate implements IDBDocSB, IDBDownloadable {
  readonly id: number
  readonly research_id: number
  readonly created_at: Date
  readonly deleted: boolean | null
  readonly is_draft: boolean | null
  readonly comment_count?: number
  readonly file_download_count?: number
  readonly update_author?: DBAuthor
  created_by: number | null
  modified_at: Date | null
  title: string
  description: string
  images: DBMedia[] | null
  file_link: string | null
  files: IMediaFile[] | null
  video_url: string | null

  constructor(obj: Omit<DBResearchUpdate, 'id'>) {
    Object.assign(this, obj)
  }
}

export class ResearchUpdate implements IDoc, IDownloadable {
  id: number
  author: Author | null
  commentCount: number
  createdAt: Date
  deleted: boolean
  description: string
  fileDownloadCount: number
  files: IMediaFile[] | null
  images: Image[] | null
  isDraft: boolean
  hasFileLink: boolean
  modifiedAt: Date | null
  researchId: number
  title: string
  videoUrl: string | null
  research?: DBResearchItem

  constructor(obj: ResearchUpdate) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBResearchUpdate, images?: Image[]) {
    return new ResearchUpdate({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      author: obj.update_author ? Author.fromDB(obj.update_author) : null,
      title: obj.title,
      description: obj.description,
      images:
        images?.filter((x) => obj.images?.map((x) => x.id)?.includes(x.id)) ||
        [],
      files: obj.files,
      // no fileLink as it must be shown only for authenticated users
      hasFileLink: !!obj.file_link,
      videoUrl: obj.video_url,
      deleted: obj.deleted || false,
      commentCount: obj.comment_count || 0,
      fileDownloadCount: obj.file_download_count || 0,
      isDraft: !!obj.is_draft,
      researchId: obj.research_id,
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

export type ResearchFormData = {
  title: string
  description: string
  category?: SelectValue
  tags?: number[]
  collaborators?: string[]
  image?: IConvertedFileMeta
  existingImage: Image | null
}

export interface ResearchUpdateFormData extends IFilesForm {
  title: string
  description: string
  images?: File[]
  existingImages: Image[] | null
  files?: File[]
  existingFiles?: MediaFile[] | null
  fileLink?: string
  videoUrl?: string
}
