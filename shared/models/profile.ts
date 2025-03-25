import type { ContentType } from './common'
import type { DBDocSB, Doc } from './document'
import type { News } from './news'
import type { IPatreonUser } from './patreon'

export class DBProfile {
  id: number
  username: string
  display_name: string
  is_verified: boolean
  is_supporter: boolean
  photo_url: string
  country: string
  patreon?: IPatreonUser
  roles: string[] | null

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}

export class Profile {
  id: number
  username: string
  displayName: string
  isVerified: boolean
  isSupporter: boolean
  photoUrl: string
  country: string
  patreon?: IPatreonUser
  roles: string[] | null

  constructor(obj: any) {
    Object.assign(this, obj)
  }

  static fromDB(dbProfile: DBProfile) {
    return new Profile({
      id: dbProfile.id,
      username: dbProfile.username,
    })
  }
}

// Notifications here to avoid circular dependencies

export type NotificationActionType = 'newContent' | 'newComment'
type NotificationContentType = 'news' | 'comment' | 'reply'
// type NotificationContentType = 'news' | 'research' | 'researchUpdate' | 'project' | 'question' | 'comment' | 'reply'

type NotificationSourceContentType = ContentType
// type NotificationSourceContentType = 'news' | 'research' | 'researchUpdate' | 'project' | 'question' // What page on the platform should be linked to
type NotificationSourceContent = News
type NotificationParentContentType = 'comment'
// type NotificationParentContentType = 'research' | 'comment'
type NotifcationParentContent = Comment

export class DBNotification implements DBDocSB {
  readonly id: number
  readonly action_type: NotificationActionType
  readonly content_type: NotificationContentType
  readonly created_at: Date
  modified_at: Date | null
  readonly owned_by: DBProfile
  owned_by_id: number
  parent_content_type: NotificationParentContentType | null
  parent_content_id: number | null
  read: boolean
  source_content_type: NotificationSourceContentType
  source_content_id: number
  readonly triggered_by: DBProfile
  triggered_by_id: number

  constructor(obj: any) {
    Object.assign(this, obj)
  }
}

export class Notification implements Doc {
  id: number
  actionType: NotificationActionType
  contentType: NotificationContentType
  createdAt: Date
  modifiedAt: Date | null
  ownedById: number
  parentContentType: NotificationParentContentType | null
  parentContentId: number | null
  parentContent?: NotifcationParentContent
  read: boolean
  sourceContentType: NotificationSourceContentType
  sourceContentId: number
  sourceContent?: NotificationSourceContent
  triggeredBy?: Profile | null

  constructor(obj: Notification) {
    Object.assign(this, obj)
  }

  static fromDB(dbNotification: DBNotification, triggeredBy: DBProfile | null) {
    return new Notification({
      id: dbNotification.id,
      actionType: dbNotification.action_type,
      contentType: dbNotification.content_type,
      createdAt: new Date(dbNotification.created_at),
      modifiedAt: dbNotification.modified_at
        ? new Date(dbNotification.modified_at)
        : null,
      ownedById: dbNotification.owned_by_id,
      parentContentType: dbNotification.parent_content_type,
      parentContentId: dbNotification.parent_content_id,
      read: dbNotification.read,
      sourceContentType: dbNotification.source_content_type,
      sourceContentId: dbNotification.source_content_id,
      triggeredBy: triggeredBy ? Profile.fromDB(triggeredBy) : null,
    })
  }
}

export type NewNotificationData = {
  actionType: NotificationActionType
  contentType: NotificationContentType
  ownedById: number
  parentContentType?: NotificationParentContentType
  parentContentId?: number
  sourceContentType: NotificationSourceContentType
  sourceContentId: number
  triggeredById: number
}
