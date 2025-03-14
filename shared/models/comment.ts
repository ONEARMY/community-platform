import { DBDocSB, Doc } from './document'

import type { ContentTypes } from './common'

export class DBCommentAuthor {
  readonly id: number
  readonly firebase_auth_id: string
  readonly display_name: string
  readonly username: string
  readonly photo_url: string
  readonly country: string
  readonly is_verified: boolean
  readonly is_supporter: boolean

  constructor(obj: DBCommentAuthor) {
    Object.assign(this, obj)
  }
}

export class CommentAuthor {
  id: number
  name: string
  username: string
  firebaseAuthId: string
  photoUrl: string
  country: string
  isVerified: boolean
  isSupporter: boolean

  constructor(obj: CommentAuthor) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBCommentAuthor) {
    return new CommentAuthor({
      id: obj.id,
      name: obj.display_name,
      username: obj.username,
      firebaseAuthId: obj.firebase_auth_id,
      photoUrl: obj.photo_url,
      isVerified: obj.is_verified,
      isSupporter: obj.is_supporter,
      country: obj.country,
    })
  }
}

export class DBComment extends DBDocSB {
  readonly profile?: DBCommentAuthor
  created_by: number | null
  modified_at: string | null
  comment: string
  source_id: number | null
  source_type: ContentTypes
  source_id_legacy: string | null
  parent_id: number | null
  deleted: boolean | null

  static toDB(obj: Comment) {
    return new DBComment({
      id: obj.id,
      created_at: new Date(obj.createdAt),
      created_by: obj.createdBy?.id || null,
      modified_at: obj.modifiedAt ? obj.modifiedAt.toUTCString() : null,
      comment: obj.comment,
      source_id: typeof obj.sourceId === 'number' ? obj.sourceId : null,
      source_id_legacy: typeof obj.sourceId === 'string' ? obj.sourceId : null,
      source_type: obj.sourceType,
      parent_id: obj.parentId,
      deleted: obj.deleted,
    })
  }
}

export class Comment extends Doc {
  modifiedAt: Date | null
  createdBy: CommentAuthor | null
  comment: string
  sourceId: number | string
  sourceType: ContentTypes
  parentId: number | null
  deleted: boolean | null
  highlighted?: boolean
  replies?: Reply[]

  static fromDB(obj: DBComment, replies?: Reply[]) {
    return new Comment({
      id: obj.id,
      createdAt: new Date(obj.created_at),
      createdBy: obj.profile ? CommentAuthor.fromDB(obj.profile) : null,
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
