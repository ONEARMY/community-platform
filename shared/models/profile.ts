import type { Comment } from './comment'
import type {
  IConvertedFileMeta,
  ILocation,
  SubscribableContentTypes,
} from './common'
import type { IDBDocSB, IDoc } from './document'
import type { DBMedia, Image } from './media'
import type { IDBModeration, IModeration, Moderation } from './moderation'
import type { News } from './news'
import type { IPatreonUser } from './patreon'
import type { Question } from './question'
import type { ResearchItem, ResearchUpdate } from './research'
import type { Tag } from './tag'
import type {
  IExternalLink,
  IUserImpact,
  ProfileTypeName,
  UserVisitorPreference,
} from './user'

export class DBProfile {
  id: number
  created_at: Date
  username: string
  display_name: string
  is_verified: boolean
  is_supporter: boolean
  photo: DBMedia | null
  cover_images: DBMedia[] | null
  country: string
  patreon?: IPatreonUser
  roles: string[] | null
  type: string | null
  open_to_visitors: UserVisitorPreference | null
  is_blocked_from_messaging: boolean | null
  about: string | null
  impact: IUserImpact
  is_contactable: boolean
  last_active: Date | null
  links: IExternalLink[] | null
  location: ILocation
  map_pin_description: string | null
  tags: number[]
  total_views: number

  constructor(obj: DBProfile) {
    Object.assign(this, obj)
  }
}

export class Profile {
  id: number
  createdAt: Date
  username: string
  displayName: string
  isVerified: boolean
  isSupporter: boolean
  country: string
  about: string | null
  type: ProfileTypeName
  impact: IUserImpact
  photo: Image | null
  isContactable: boolean
  isBlockedFromMessaging: boolean
  openToVisitors: UserVisitorPreference | null
  links: IExternalLink[] | null
  location: ILocation
  tags?: Tag[]
  totalViews: number
  roles: string[] | null
  lastActive: Date | null
  coverImages: Image[] | null
  patreon: IPatreonUser | null
  mapPinDescription: string
  authorUsefulVotes?: AuthorVotes[]

  constructor(obj: Profile) {
    Object.assign(this, obj)
  }

  static fromDB(
    dbProfile: DBProfile,
    photo: Image = null,
    coverImages: Image[] = null,
    authorVotes?: AuthorVotes[],
  ) {
    return new Profile({
      id: dbProfile.id,
      createdAt: dbProfile.created_at,
      country: dbProfile.country,
      displayName: dbProfile.display_name,
      username: dbProfile.username,
      photo: photo,
      isSupporter: dbProfile.is_supporter,
      isVerified: dbProfile.is_verified,
      roles: dbProfile.roles || null,
      type: (dbProfile.type as ProfileTypeName) || 'member',
      openToVisitors: dbProfile.open_to_visitors,
      isBlockedFromMessaging: !!dbProfile.is_blocked_from_messaging,
      about: dbProfile.about,
      coverImages: coverImages,
      impact: dbProfile.impact,
      isContactable: !!dbProfile.is_contactable,
      lastActive: dbProfile.last_active,
      links: dbProfile.links,
      location: dbProfile.location,
      mapPinDescription: dbProfile.map_pin_description,
      patreon: dbProfile.patreon,
      totalViews: dbProfile.total_views,
      authorUsefulVotes: authorVotes,
    })
  }
}

// Notifications here to avoid circular dependencies

export type NotificationActionType = 'newContent' | 'newComment'
export type NotificationContentType = 'researchUpdate' | 'comment' | 'reply'

type NotificationContent = News | Comment | Question | ResearchUpdate
type NotificationSourceContentType = SubscribableContentTypes
type NotificationSourceContent = News | Question | ResearchItem

type BasicAuthorDetails = Pick<Profile, 'id' | 'username' | 'photo'>

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

  email: {
    body: string | undefined
    buttonLabel: string
    preview: string
    subject: string
  }
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
  slug: string

  body?: string

  constructor(obj: NotificationDisplay) {
    Object.assign(this, obj)
  }

  static setEmailBody(notification: Notification): string | undefined {
    switch (notification.contentType) {
      case 'researchUpdate': {
        return `${notification.parentContent?.title}:\n\n${notification.parentContent?.description}`
      }
      default: {
        return undefined
      }
    }
  }

  static setEmailButtonLabel(notification: Notification) {
    switch (notification.contentType) {
      case 'researchUpdate': {
        return 'Join the discussion'
      }
      case 'comment': {
        return 'See the full discussion'
      }
      case 'reply': {
        return 'See the full discussion'
      }
      default: {
        return 'View now'
      }
    }
  }

  static setEmailPreview(notification: Notification, parentTitle: string) {
    switch (notification.contentType) {
      case 'researchUpdate': {
        return `New research update on ${parentTitle}`
      }
      case 'comment': {
        if (notification.triggeredBy && notification.triggeredBy.username) {
          return `${notification.triggeredBy.username} has left a new comment`
        }
        return 'A new comment notification'
      }
      case 'reply': {
        if (notification.triggeredBy && notification.triggeredBy.username) {
          return `${notification.triggeredBy.username} has left a new reply`
        }
        return 'A new reply notification'
      }
      default: {
        return 'A new notification'
      }
    }
  }

  static setEmailSubject(notification: Notification, parentTitle: string) {
    switch (notification.contentType) {
      case 'researchUpdate': {
        return `New update on ${parentTitle}`
      }
      case 'comment': {
        return `A new comment on ${parentTitle}`
      }
      case 'reply': {
        return `A new reply on ${parentTitle}`
      }
      default: {
        return 'A new notification'
      }
    }
  }

  static setBody(notification: Notification): string | undefined {
    switch (notification.contentType) {
      case 'researchUpdate': {
        return notification.parentContent?.title
      }
      case 'comment': {
        return (notification.content as Comment).comment
      }
      case 'reply': {
        return (notification.content as Comment).comment
      }
      default: {
        return ''
      }
    }
  }

  static setDate(notification: Notification) {
    return notification.modifiedAt
      ? new Date(notification.modifiedAt)
      : new Date(notification.createdAt)
  }

  static setParentMiddle(notification: Notification) {
    switch (notification.contentType) {
      case 'researchUpdate': {
        return 'published a new update'
      }
      case 'comment': {
        return 'left a comment'
      }
      case 'reply': {
        return 'left a reply'
      }
      default: {
        return ''
      }
    }
  }

  static setParentTitle(notification: Notification) {
    let title = notification.sourceContent?.title || ''

    if (
      notification.contentType != 'researchUpdate' &&
      notification.parentContent?.title
    ) {
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
    switch (contentType) {
      case 'comment': {
        return 'discussion'
      }
      case 'reply': {
        return 'discussion'
      }
      default: {
        return 'thunderbolt'
      }
    }
  }

  static setSidebarImage(author: BasicAuthorDetails | undefined): string {
    return author?.photo?.publicUrl || ''
  }

  static setSlug(notification: Notification) {
    switch (notification.contentType) {
      case 'researchUpdate': {
        return `${notification.sourceContentType}/${notification.sourceContent?.slug}#update_${notification.parentContent?.id}`
      }
      case 'comment': {
        return this.setSlugDiscussion(notification)
      }
      case 'reply': {
        return this.setSlugDiscussion(notification)
      }
      default: {
        return `${notification.sourceContentType}/${notification.sourceContent?.slug}`
      }
    }
  }

  static setSlugDiscussion(notification: Notification) {
    if (notification.sourceContentType == 'research') {
      return `research/${notification.sourceContent?.slug}?update_${notification.parentContentId}#comment:${notification.content?.id}`
    }
    return `${notification.sourceContentType}/${notification.sourceContent?.slug}#comment:${notification.content?.id}`
  }

  static fromNotification(notification: Notification): NotificationDisplay {
    const parentTitle = this.setParentTitle(notification)

    return new NotificationDisplay({
      id: notification.id,
      isRead: notification.isRead,
      contentType: notification.contentType,
      email: {
        body: this.setEmailBody(notification),
        buttonLabel: this.setEmailButtonLabel(notification),
        preview: this.setEmailPreview(notification, parentTitle),
        subject: this.setEmailSubject(notification, parentTitle),
      },
      sidebar: {
        icon: this.setSidebarIcon(notification.contentType),
        image: this.setSidebarImage(notification.triggeredBy),
      },
      title: {
        triggeredBy: notification.triggeredBy?.username || '',
        middle: this.setParentMiddle(notification),
        parentTitle,
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
  parentCommentId?: number | null
  parentContentId: number | null
  sourceContentType: NotificationSourceContentType
  sourceContentId: number
  triggeredById: number
}

export type ProfileFormData = {
  displayName: string
  tagIds: number[]
  about: string
  country: string
  links: IExternalLink[]
  isContactable: boolean
  type: ProfileTypeName
  existingImageId?: string
  image?: IConvertedFileMeta
  existingCoverImageIds?: string[]
  coverImages?: IConvertedFileMeta[]
  showVisitorPolicy: boolean
  visitorPolicy: UserVisitorPreference
}

export class DBMapPin implements IDBModeration {
  readonly id: number
  readonly profile: DBPinProfile
  profile_id: number
  country: string // check if necessary
  country_code: string
  administrative: string
  postcode: string
  lat: number
  lng: number
  moderation: Moderation
  moderation_feedback: string
}

export class MapPin implements IModeration {
  readonly id: number
  readonly profileId: number
  readonly profile: PinProfile
  country: string
  countryCode: string
  administrative: string
  postcode: string
  lat: number
  lng: number
  moderation: Moderation
  moderatonFeedback?: string

  constructor(obj: MapPin) {
    Object.assign(this, obj)
  }
}

export interface DBAuthorVotes {
  content_type: string
  vote_count: number
}

export class AuthorVotes {
  contentType: string
  voteCount: number

  constructor(obj: AuthorVotes) {
    Object.assign(this, obj)
  }

  static fromDB(dbVotes: DBAuthorVotes) {
    return new AuthorVotes({
      contentType: dbVotes.content_type,
      voteCount: dbVotes.vote_count,
    })
  }
}

export type DBPinProfile = Pick<
  DBProfile,
  | 'id'
  | 'display_name'
  | 'username'
  | 'is_verified'
  | 'is_supporter'
  | 'photo'
  | 'tags'
  | 'type'
  | 'open_to_visitors'
>

export type PinProfile = Pick<
  Profile,
  | 'id'
  | 'displayName'
  | 'username'
  | 'isVerified'
  | 'isSupporter'
  | 'photo'
  | 'tags'
  | 'type'
  | 'openToVisitors'
  | 'about'
>
