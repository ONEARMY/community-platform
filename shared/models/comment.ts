import { Author } from './author'

import type { DBAuthor } from './author'
import type { ContentType } from './common'
import type { IDBDocSB, IDoc } from './document'

export class DBComment implements IDBDocSB {
  readonly id: number
  readonly created_at: Date
  readonly modified_at: Date | null
  readonly created_by: number | null
  readonly deleted: boolean

  readonly profile?: DBAuthor
  readonly comment: string
  readonly source_id: number | null
  readonly source_type: ContentType
  readonly source_id_legacy: string | null
  readonly parent_id: number | null

  constructor(comment: DBComment) {
    Object.assign(this, comment)
  }

  static toDB(obj: Comment) {
    return new DBComment({
      id: obj.id,
      created_at: new Date(obj.createdAt),
      created_by: obj.createdBy?.id || null,
      modified_at: obj.modifiedAt ? new Date(obj.modifiedAt) : null,
      comment: obj.comment,
      source_id: typeof obj.sourceId === 'number' ? obj.sourceId : null,
      source_id_legacy: typeof obj.sourceId === 'string' ? obj.sourceId : null,
      source_type: obj.sourceType,
      parent_id: obj.parentId,
      deleted: obj.deleted,
    })
  }
}

export class Comment implements IDoc {
  id: number
  createdAt: Date
  modifiedAt: Date | null
  deleted: boolean

  createdBy: Author | null
  comment: string
  sourceId: number | string
  sourceType: ContentType
  parentId: number | null
  highlighted?: boolean
  replies?: Reply[]

  constructor(comment: Comment) {
    Object.assign(this, comment)
  }

  static fromDB(obj: DBComment, replies?: Reply[]) {
    return new Comment({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      createdBy: obj.profile ? Author.fromDB(obj.profile) : null,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      comment: obj.comment,
      sourceId: obj.source_id || obj.source_id_legacy || 0,
      sourceType: obj.source_type,
      parentId: obj.parent_id,
      deleted: obj.deleted,
      replies: replies,
    })
  }
}

export type Reply = Omit<Comment, 'replies'>
