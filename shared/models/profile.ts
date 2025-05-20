import type { Comment } from './comment'
import type { SubscribableContentTypes } from './common'
import type { IDBDocSB, IDoc } from './document'
import type { News } from './news'
import type { IPatreonUser } from './patreon'
import type { Question } from './question'
import type { ResearchItem, ResearchUpdate } from './research'

export class DBProfile {
  id: number
  username: string
  display_name: string
  is_verified: boolean
  is_supporter: boolean
  photo_url: string | null
  country: string
  patreon?: IPatreonUser
  roles: string[] | null

  constructor(obj: DBProfile) {
    Object.assign(this, obj)
  }
}

export class Profile {
  id: number
  username: string
  displayName: string
  isVerified: boolean
  isSupporter: boolean
  photoUrl: string | null
  country: string
  patreon?: IPatreonUser
  roles: string[] | null

  constructor(obj: Profile) {
    Object.assign(this, obj)
  }

  static fromDB(dbProfile: DBProfile) {
    return new Profile({
      id: dbProfile.id,
      country: dbProfile.country,
      displayName: dbProfile.display_name,
      username: dbProfile.username,
      isSupporter: dbProfile.is_supporter,
      isVerified: dbProfile.is_verified,
      photoUrl: dbProfile.photo_url || null,
      roles: dbProfile.roles || null,
    })
  }
}

// Notifications here to avoid circular dependencies

export type NotificationActionType = 'newContent' | 'newComment'
type NotificationContentType = 'news' | 'comment' | 'reply'
// type NotificationContentType = 'news' | 'research' | 'researchUpdate' | 'project' | 'question' | 'comment' | 'reply'

type NotificationContent = News | Comment | Question | ResearchUpdate
type NotificationSourceContentType = SubscribableContentTypes
// type NotificationSourceContentType = 'news' | 'research' | 'researchUpdate' | 'project' | 'question' // What page on the platform should be linked to
type NotificationSourceContent = News | Question | ResearchItem

type BasicAuthorDetails = Pick<Profile, 'id' | 'username' | 'photoUrl'>

export class DBNotification implements IDBDocSB {
  readonly id: number
  readonly action_type: NotificationActionType
  readonly content_id: number
  readonly content_type: NotificationContentType
  readonly created_at: Date
  is_read: boolean
  modified_at: Date | null
  readonly owned_by: DBProfile
  readonly owned_by_id: number
  readonly parent_comment_id: number | null
  readonly parent_content_id: number | null
  readonly source_content_type: NotificationSourceContentType
  readonly source_content_id: number
  readonly triggered_by: DBProfile
  readonly triggered_by_id: number

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}

export class Notification implements IDoc {
  id: number
  actionType: NotificationActionType
  contentId: number
  contentType: NotificationContentType
  createdAt: Date
  modifiedAt: Date | null
  ownedById: number
  ownedBy?: BasicAuthorDetails
  isRead: boolean
  parentCommentId: number | null
  parentContentId: number | null
  sourceContentType: NotificationSourceContentType
  sourceContentId: number
  triggeredBy?: BasicAuthorDetails

  content?: NotificationContent
  parentComment?: Comment
  parentContent?: ResearchItem
  sourceContent?: NotificationSourceContent

  constructor(obj: Notification) {
    Object.assign(this, obj)
  }

  static fromDB(dbNotification: DBNotification) {
    return new Notification({
      id: dbNotification.id,
      actionType: dbNotification.action_type,
      contentType: dbNotification.content_type,
      contentId: dbNotification.content_id,
      createdAt: new Date(dbNotification.created_at),
      modifiedAt: dbNotification.modified_at
        ? new Date(dbNotification.modified_at)
        : null,
      ownedById: dbNotification.owned_by_id,
      isRead: dbNotification.is_read,
      parentContentId: dbNotification.parent_content_id,
      parentCommentId: dbNotification.parent_comment_id,
      sourceContentType: dbNotification.source_content_type,
      sourceContentId: dbNotification.source_content_id,
      triggeredBy: dbNotification.triggered_by
        ? Profile.fromDB(dbNotification.triggered_by)
        : undefined,
      ownedBy: dbNotification.owned_by
        ? Profile.fromDB(dbNotification.owned_by)
        : undefined,
    })
  }
}

export type NewNotificationData = {
  actionType: NotificationActionType
  contentId: number
  contentType: NotificationContentType
  ownedById: number
  parentCommentId: number | null
  parentContentId: number | null
  sourceContentType: NotificationSourceContentType
  sourceContentId: number
  triggeredById: number
}
