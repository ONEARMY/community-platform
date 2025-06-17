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
export type NotificationContentType = 'news' | 'comment' | 'reply'

type NotificationContent = News | Comment | Question | ResearchUpdate
type NotificationSourceContentType = SubscribableContentTypes
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
  isRead: boolean
  parentCommentId: number | null
  parentContentId: number | null
  sourceContentType: NotificationSourceContentType
  sourceContentId: number

  content?: NotificationContent
  ownedBy?: BasicAuthorDetails
  parentComment?: Comment
  parentContent?: ResearchUpdate
  sourceContent?: NotificationSourceContent
  triggeredBy?: BasicAuthorDetails

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

export class NotificationDisplay {
  id: number
  isRead: boolean
  contentType: NotificationContentType

  sidebar: {
    icon?: string
    image?: string
  }
  title: {
    triggeredBy?: string
    middle: string
    parentTitle: string
    parentSlug: string
  }
  date: Date
  body?: string
  slug: string

  context?: string
  actionLabel?: string

  constructor(obj: NotificationDisplay) {
    Object.assign(this, obj)
  }

  static setBody(notification: Notification): string | undefined {
    return notification.content
      ? (notification.content as any).comment
      : undefined
  }

  static setDate(notification: Notification) {
    return notification.modifiedAt
      ? new Date(notification.modifiedAt)
      : new Date(notification.createdAt)
  }

  static setParentTitle(notification: Notification) {
    let title = notification.sourceContent?.title || ''

    if (notification.parentContent?.title) {
      title = title + `: ${notification.parentContent.title}`
    }
    return title
  }

  static setParentSlug(notification: Notification) {
    let path = `${notification.sourceContentType}/${notification.sourceContent?.slug || ''}`
    if (notification.sourceContentType == 'research') {
      path = path + `#update_${notification.parentContentId}`
    }

    return path
  }

  static setSidebarIcon(contentType: NotificationContentType): string {
    const options: { [option in NotificationContentType]: string } = {
      comment: 'discussion',
      reply: 'discussion',
      news: 'news',
    }
    return options[contentType]
  }

  static setSidebarImage(author: BasicAuthorDetails | undefined): string {
    return author?.photoUrl || ''
  }

  static setSlug(notification: Notification) {
    if (notification.sourceContentType == 'research') {
      return `research/${notification.sourceContent?.slug}?update_${notification.parentContentId}#comment:${notification.content?.id}`
    }
    return `${notification.sourceContentType}/${notification.sourceContent?.slug}#comment:${notification.content?.id}`
  }

  static fromNotification(notification: Notification): NotificationDisplay {
    return new NotificationDisplay({
      id: notification.id,
      isRead: notification.isRead,
      contentType: notification.contentType,
      sidebar: {
        icon: this.setSidebarIcon(notification.contentType),
        image: this.setSidebarImage(notification.triggeredBy),
      },
      title: {
        triggeredBy: notification.triggeredBy?.username || '',
        middle: `left a ${notification.contentType}`,
        parentTitle: this.setParentTitle(notification),
        parentSlug: this.setParentSlug(notification),
      },
      date: this.setDate(notification),
      body: this.setBody(notification),
      slug: this.setSlug(notification),
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
