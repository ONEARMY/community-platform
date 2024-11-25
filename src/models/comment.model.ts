export class DBCommentAuthor {
  id: number
  firebase_auth_id: string
  display_name: string
  photo_url: string
  country: string
  is_verified: boolean

  constructor(obj: DBCommentAuthor) {
    Object.assign(this, obj)
  }

  static toDB(obj: CommentAuthor) {
    return new DBCommentAuthor({
      id: obj.id,
      display_name: obj.name,
      firebase_auth_id: obj.firebaseAuthId,
      photo_url: obj.photoUrl,
      is_verified: obj.isVerified,
      country: obj.country,
    })
  }
}

export class CommentAuthor {
  id: number
  name: string
  firebaseAuthId: string
  photoUrl: string
  country: string
  isVerified: boolean

  constructor(obj: CommentAuthor) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBCommentAuthor) {
    return new CommentAuthor({
      id: obj.id,
      name: obj.display_name,
      firebaseAuthId: obj.firebase_auth_id,
      photoUrl: obj.photo_url,
      isVerified: obj.is_verified,
      country: obj.country,
    })
  }
}

export class DBComment {
  id: number
  created_at: string
  created_by: number | null
  modified_at: string | null
  comment: string
  source_id: number | null
  source_type: string
  source_id_legacy: string | null
  parent_id: number | null
  deleted: boolean | null
  profile?: DBCommentAuthor

  constructor(obj: DBComment) {
    Object.assign(this, obj)
  }

  static toDB(obj: Comment) {
    return new DBComment({
      id: obj.id,
      created_at: obj.createdAt.toUTCString(),
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

export class Comment {
  id: number
  createdAt: Date
  modifiedAt: Date | null
  createdBy: CommentAuthor | null
  comment: string
  sourceId: number | string
  sourceType: string
  parentId: number | null
  deleted: boolean | null
  replies?: Reply[]

  constructor(obj: Comment) {
    Object.assign(this, obj)
  }

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
