import { ProfileTag } from './profileTag'

import type { Comment } from './comment'
import type { SubscribableContentTypes } from './common'
import type { IDBDocSB, IDoc } from './document'
import type { Project } from './library'
import type { DBMedia, Image } from './media'
import type { IDBModeration, IModeration, Moderation } from './moderation'
import type { News } from './news'
import type { IPatreonUser } from './patreon'
import type { DBProfileTag } from './profileTag'
import type { Question } from './question'
import type { ResearchItem, ResearchUpdate } from './research'
import type {
  IUserImpact,
  ProfileTypeName,
  UserVisitorPreference,
} from './user'

export class DBProfile {
  readonly id: number
  readonly created_at: Date
  readonly tags?: DBProfileTag[]
  readonly pin?: DBMapPin
  username: string
  display_name: string
  is_verified: boolean
  is_supporter: boolean
  photo: DBMedia | null
  cover_images: DBMedia[] | null
  country: string
  patreon?: IPatreonUser
  roles: string[] | null
  type: ProfileTypeName
  visitor_policy: string | null
  is_blocked_from_messaging: boolean | null
  about: string | null
  impact: string | null
  is_contactable: boolean
  last_active: Date | null
  website: string | null
  total_views: number
  auth_id: string
  tag_ids: number[] | null

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
  impact: IUserImpact | null
  photo: Image | null
  isContactable: boolean
  isBlockedFromMessaging: boolean
  visitorPolicy: UserVisitorPreference | null
  website: string | null
  tags?: ProfileTag[]
  totalViews: number
  roles: string[] | null
  lastActive: Date | null
  coverImages: Image[] | null
  patreon: IPatreonUser | null
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
    let impact = null

    try {
      impact = dbProfile.impact ? JSON.parse(dbProfile.impact) : null
    } catch (error) {
      console.error('error parsing impact')
    }

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
      type: dbProfile.type,
      visitorPolicy: dbProfile.visitor_policy
        ? (JSON.parse(dbProfile.visitor_policy) as UserVisitorPreference)
        : null,
      isBlockedFromMessaging: !!dbProfile.is_blocked_from_messaging,
      about: dbProfile.about,
      coverImages: coverImages,
      impact,
      isContactable: !!dbProfile.is_contactable,
      lastActive: dbProfile.last_active,
      website: dbProfile.website,
      patreon: dbProfile.patreon,
      totalViews: dbProfile.total_views,
      authorUsefulVotes: authorVotes,
      tags: dbProfile.tags?.map((x) => ProfileTag.fromDB(x)),
    })
  }
}

// Notifications here to avoid circular dependencies

export type NotificationActionType = 'newContent' | 'newComment'
export type NotificationContentType = 'researchUpdate' | 'comment' | 'reply'
export type BasicAuthorDetails = Pick<Profile, 'id' | 'username' | 'photo'>

type NotificationContent = News | Comment | Question | ResearchUpdate
type NotificationSourceContentType = SubscribableContentTypes
type NotificationSourceContent = News | Project | Question | ResearchItem

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

  static setEmailBody(notification: Notification): string {
    switch (notification.contentType) {
      case 'researchUpdate': {
        return `${(notification.content as ResearchUpdate)?.title}:\n\n${(notification.content as ResearchUpdate)?.description}`
      }
      default: {
        return this.setBody(notification) || ''
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
        return (notification.content as ResearchUpdate)?.title
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
    const slug = notification.sourceContent?.slug || ''
    switch (notification.sourceContentType) {
      case 'research': {
        if (notification.actionType === 'newComment') {
          return `research/${slug}#update_${notification.parentContentId}`
        }
        return `${notification.sourceContentType}/${slug}`
      }
      case 'research_update': {
        return `research/${slug}#update_${notification.parentContentId}`
      }
      case 'projects': {
        return `library/${slug}`
      }
      default: {
        return `${notification.sourceContentType}/${slug}`
      }
    }
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
    const baseSlug = this.setParentSlug(notification)
    switch (notification.contentType) {
      case 'comment': {
        return this.setSlugDiscussion(notification)
      }
      case 'reply': {
        return this.setSlugDiscussion(notification)
      }
      case 'researchUpdate': {
        return `${baseSlug}#update_${notification.contentId}`
      }
    }
  }

  static setSlugDiscussion(notification: Notification) {
    const baseSlug = this.setParentSlug(notification)

    switch (notification.sourceContentType) {
      case 'research': {
        return `research/${notification.sourceContent?.slug}?update_${notification.parentContentId}#comment:${notification.content?.id}`
      }
      default: {
        return `${baseSlug}#comment:${notification.content?.id}`
      }
    }
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
  website: string
  isContactable: boolean
  type: ProfileTypeName
  photo?: File
  existingPhoto?: Image
  existingCoverImages?: Image[]
  existingCoverImageIds?: string[]
  coverImages?: File[]
  showVisitorPolicy: boolean
  visitorPreferencePolicy?: UserVisitorPreference['policy']
  visitorPreferenceDetails?: UserVisitorPreference['details']
}

export class DBMapPin implements IDBModeration {
  readonly id: number
  readonly profile: DBPinProfile
  profile_id: number
  country: string // check if necessary
  country_code: string
  name: string | null
  administrative: string | null
  post_code: string | null
  lat: number
  lng: number
  moderation: Moderation
  moderation_feedback: string
}

export class MapPin implements IModeration {
  readonly id: number
  readonly profileId: number
  readonly profile: PinProfile | null
  country: string
  countryCode: string
  name: string | null
  administrative: string | null
  postCode: string | null
  lat: number
  lng: number
  moderation: Moderation
  moderationFeedback?: string

  constructor(obj: MapPin) {
    Object.assign(this, obj)
  }
}

export type MapPinFormData = {
  lat: number
  lng: number
  country: string
  countryCode: string
  administrative: string
  postCode: string
  name: string
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
  | 'country'
  | 'is_verified'
  | 'is_supporter'
  | 'photo'
  | 'tags'
  | 'type'
  | 'visitor_policy'
  | 'about'
  | 'is_contactable'
  | 'last_active'
>

export type PinProfile = Pick<
  Profile,
  | 'id'
  | 'displayName'
  | 'username'
  | 'country'
  | 'isVerified'
  | 'isSupporter'
  | 'photo'
  | 'tags'
  | 'type'
  | 'visitorPolicy'
  | 'about'
  | 'isContactable'
  | 'lastActive'
>

export type UpsertPin = Omit<
  DBMapPin,
  'id' | 'profile' | 'moderation' | 'moderation_feedback'
>
