import type { Author, DBAuthor } from './author'
import type { DiscussionContentTypes } from './common'
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
  readonly source_type: DiscussionContentTypes
  readonly source_id_legacy: string | null
  readonly parent_id: number | null

  constructor(comment: DBComment) {
    Object.assign(this, comment)
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
  sourceType: DiscussionContentTypes
  parentId: number | null
  highlighted?: boolean
  replies?: Reply[]

  constructor(comment: Comment) {
    Object.assign(this, comment)
  }
}

export type Reply = Omit<Comment, 'replies'>
