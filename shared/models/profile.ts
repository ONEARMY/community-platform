import { ProfileBadge } from './profileBadge';
import { ProfileTag } from './profileTag';
import { ProfileType } from './profileType';

import type { Comment } from './comment';
import type { SubscribableContentTypes } from './common';
import type { IDBDocSB, IDoc } from './document';
import type { DBMedia, Image } from './media';
import type { IDBModeration, IModeration, Moderation } from './moderation';
import type { News } from './news';
import type { IPatreonUser } from './patreon';
import type { DBProfileBadgeJoin } from './profileBadge';
import type { DBProfileTagJoin } from './profileTag';
import type { DBProfileType } from './profileType';
import type { Question } from './question';
import type { ResearchUpdate } from './research';
import type { IUserImpact, UserVisitorPreference } from './user';

export class DBProfile {
  readonly id: number;
  readonly created_at: Date;
  readonly tags?: DBProfileTagJoin[];
  readonly badges?: DBProfileBadgeJoin[];
  readonly pin?: DBMapPin;
  readonly type?: DBProfileType;
  username: string;
  display_name: string;
  photo: DBMedia | null;
  cover_images: DBMedia[] | null;
  country: string;
  patreon?: IPatreonUser;
  roles: string[] | null;
  visitor_policy: string | null;
  is_blocked_from_messaging: boolean | null;
  about: string | null;
  impact: string | null;
  is_contactable: boolean | null;
  last_active: Date | null;
  website: string | null;
  total_views: number;
  auth_id: string;
  profile_type: number;
  donations_enabled: boolean;

  constructor(obj: DBProfile) {
    Object.assign(this, obj);
  }
}

export class Profile {
  id: number;
  createdAt: Date;
  username: string;
  displayName: string;
  country: string;
  about: string | null;
  type: ProfileType | null;
  impact: IUserImpact | null;
  photo: Image | null;
  isContactable: boolean | null;
  isBlockedFromMessaging: boolean;
  visitorPolicy: UserVisitorPreference | null;
  website: string | null;
  tags?: ProfileTag[];
  badges?: ProfileBadge[];
  totalViews: number;
  roles: string[] | null;
  lastActive: Date | null;
  coverImages: Image[] | null;
  patreon: IPatreonUser | null;
  authorUsefulVotes?: AuthorVotes[];
  donationsEnabled: boolean;

  constructor(obj: Profile) {
    Object.assign(this, obj);
  }

  static fromDB(
    dbProfile: DBProfile,
    photo: Image | null = null,
    coverImages: Image[] | null = null,
    authorVotes?: AuthorVotes[],
  ) {
    let impact = null;

    try {
      impact = dbProfile.impact ? JSON.parse(dbProfile.impact) : null;
    } catch (error) {
      console.error('error parsing impact');
    }

    return new Profile({
      id: dbProfile.id,
      createdAt: dbProfile.created_at,
      country: dbProfile.country,
      displayName: dbProfile.display_name,
      username: dbProfile.username,
      photo: photo ?? null,
      roles: dbProfile.roles || null,
      type: dbProfile.type ? ProfileType.fromDB(dbProfile.type) : null,
      visitorPolicy: dbProfile.visitor_policy
        ? (JSON.parse(dbProfile.visitor_policy) as UserVisitorPreference)
        : null,
      isBlockedFromMessaging: !!dbProfile.is_blocked_from_messaging,
      about: dbProfile.about,
      coverImages: coverImages ?? null,
      impact,
      isContactable: dbProfile.is_contactable || null,
      lastActive: dbProfile.last_active,
      website: dbProfile.website,
      patreon: dbProfile.patreon ?? null,
      totalViews: dbProfile.total_views,
      authorUsefulVotes: authorVotes,
      donationsEnabled: dbProfile.donations_enabled,
      badges: dbProfile.badges?.map((x) => ProfileBadge.fromDBJoin(x)),
      tags: dbProfile.tags?.map((x) => ProfileTag.fromDBJoin(x)),
    });
  }
}

// Notifications here to avoid circular dependencies

export type NotificationActionType = 'newContent' | 'newComment' | 'newReply';
export const NotificationContentTypes = ['research_updates', 'comments'] as const;
export type NotificationContentType = (typeof NotificationContentTypes)[number];
export type BasicAuthorDetails = Pick<Profile, 'id' | 'username' | 'photo'>;
export type ProfileListItem = Pick<
  Profile,
  'id' | 'username' | 'displayName' | 'photo' | 'country' | 'badges' | 'type'
>;

type NotificationContent = News | Comment | Question | ResearchUpdate;
type NotificationSourceContentType = SubscribableContentTypes;

export class DBNotification implements IDBDocSB {
  readonly id: number;
  readonly title: string;
  readonly action_type: NotificationActionType;
  readonly content_id: number;
  readonly content_type: NotificationContentType;
  readonly created_at: Date;
  is_read: boolean;
  modified_at: Date | null;
  readonly source_content_type: NotificationSourceContentType;
  readonly source_content_id: number;
  readonly owned_by: DBProfile;
  readonly owned_by_id: number;
  readonly triggered_by: DBProfile;
  readonly triggered_by_id: number;
  readonly tenant_id: string;

  constructor(obj: Partial<DBNotification>) {
    Object.assign(this, obj);
  }
}

export class Notification implements IDoc {
  id: number;
  actionType: NotificationActionType;
  title: string;
  contentId: number;
  contentType: NotificationContentType;
  createdAt: Date;
  modifiedAt: Date | null;
  ownedById: number;
  isRead: boolean;
  sourceContentType: NotificationSourceContentType;
  sourceContentId: number;

  content?: NotificationContent;
  ownedBy?: BasicAuthorDetails;
  triggeredBy?: BasicAuthorDetails;

  constructor(obj: Notification) {
    Object.assign(this, obj);
  }

  static fromDB(dbNotification: DBNotification) {
    return new Notification({
      id: dbNotification.id,
      title: dbNotification.title,
      actionType: dbNotification.action_type,
      contentType: dbNotification.content_type,
      contentId: dbNotification.content_id,
      sourceContentId: dbNotification.source_content_id,
      sourceContentType: dbNotification.source_content_type,
      createdAt: new Date(dbNotification.created_at),
      modifiedAt: dbNotification.modified_at ? new Date(dbNotification.modified_at) : null,
      ownedById: dbNotification.owned_by_id,
      isRead: dbNotification.is_read,
      triggeredBy: dbNotification.triggered_by
        ? Profile.fromDB(dbNotification.triggered_by)
        : undefined,
      ownedBy: dbNotification.owned_by ? Profile.fromDB(dbNotification.owned_by) : undefined,
    });
  }
}

export class NotificationDisplay {
  id: number;
  isRead: boolean;
  contentType: NotificationContentType;
  body?: string;
  date: Date;
  email: {
    body: string | undefined;
    buttonLabel: string;
    preview: string;
    subject: string;
  };
  link: string;
  sidebar: {
    icon?: string;
    image?: string;
  };
  title: string;
  triggeredBy: string;

  constructor(obj: NotificationDisplay) {
    Object.assign(this, obj);
  }

  static setEmailBody(notification: Notification): string {
    switch (notification.contentType) {
      case 'research_updates': {
        return `${(notification.content as ResearchUpdate)?.title}:\n\n${
          (notification.content as ResearchUpdate)?.description
        }`;
      }
      default: {
        return this.setBody(notification) || '';
      }
    }
  }

  static setEmailButtonLabel(notification: Notification) {
    switch (notification.contentType) {
      case 'research_updates': {
        return 'Join the discussion';
      }
      case 'comments': {
        return 'See the full discussion';
      }
      default: {
        return 'View now';
      }
    }
  }

  static setEmailPreview(notification: Notification) {
    switch (notification.actionType) {
      case 'newContent': {
        return `New research update on ${notification.title}`;
      }
      case 'newComment': {
        if (notification.triggeredBy && notification.triggeredBy.username) {
          return `${notification.triggeredBy.username} has left a new comment`;
        }
        return 'A new comment notification';
      }
      case 'newReply': {
        if (notification.triggeredBy && notification.triggeredBy.username) {
          return `${notification.triggeredBy.username} has left a new reply`;
        }
        return 'A new reply notification';
      }
      default: {
        return 'A new notification';
      }
    }
  }

  static setEmailSubject(notification: Notification) {
    switch (notification.actionType) {
      case 'newContent': {
        return `New update on ${notification.title}`;
      }
      case 'newComment': {
        return `A new comment on ${notification.title}`;
      }
      case 'newReply': {
        return `A new reply on ${notification.title}`;
      }
      default: {
        return 'A new notification';
      }
    }
  }

  static setBody(notification: Notification): string | undefined {
    switch (notification.contentType) {
      case 'research_updates': {
        return (notification.content as ResearchUpdate)?.title;
      }
      case 'comments': {
        return (notification.content as Comment).comment;
      }
      default: {
        return '';
      }
    }
  }

  static setDate(notification: Notification) {
    return notification.modifiedAt
      ? new Date(notification.modifiedAt)
      : new Date(notification.createdAt);
  }

  static setTitle(notification: Notification) {
    switch (notification.actionType) {
      case 'newContent': {
        return `published a new update on ${notification.title}`;
      }
      case 'newComment': {
        return `left a comment on ${notification.title}`;
      }
      case 'newReply': {
        return `left a reply`;
      }
      default: {
        return notification.title;
      }
    }
  }

  static setSidebarIcon(contentType: NotificationContentType): string {
    switch (contentType) {
      case 'comments': {
        return 'comment';
      }
      case 'research_updates': {
        return 'update';
      }
      default: {
        return 'thunderbolt';
      }
    }
  }

  static setSidebarImage(author: BasicAuthorDetails | undefined): string {
    return author?.photo?.publicUrl || '';
  }

  static setLink(notification: Notification) {
    return `/redirect?id=${notification.contentId}&ct=${notification.contentType}`;
  }

  static fromNotification(notification: Notification): NotificationDisplay {
    return new NotificationDisplay({
      id: notification.id,
      isRead: notification.isRead,
      body: this.setBody(notification),
      contentType: notification.contentType,
      date: this.setDate(notification),
      email: {
        body: this.setEmailBody(notification),
        buttonLabel: this.setEmailButtonLabel(notification),
        preview: this.setEmailPreview(notification),
        subject: this.setEmailSubject(notification),
      },
      sidebar: {
        icon: this.setSidebarIcon(notification.contentType),
        image: this.setSidebarImage(notification.triggeredBy),
      },
      title: this.setTitle(notification),
      triggeredBy: notification.triggeredBy?.username || '',
      link: this.setLink(notification),
    });
  }
}

export type ProfileFormData = {
  displayName: string;
  tagIds: number[] | null;
  about: string;
  country: string;
  website: string;
  isContactable: boolean;
  type: string;
  photo?: File;
  existingPhoto?: Image;
  existingCoverImages?: Image[];
  existingCoverImageIds?: string[];
  coverImages?: File[];
  showVisitorPolicy: boolean;
  visitorPreferencePolicy?: UserVisitorPreference['policy'];
  visitorPreferenceDetails?: UserVisitorPreference['details'];
};

export class DBMapPin implements IDBModeration {
  readonly id: number;
  readonly profile: DBPinProfile;
  profile_id: number;
  country: string; // check if necessary
  country_code: string;
  name: string | null;
  administrative: string | null;
  post_code: string | null;
  lat: number;
  lng: number;
  moderation: Moderation;
  moderation_feedback: string;
}

export class MapPin implements IModeration {
  readonly id: number;
  readonly profileId: number;
  readonly profile: PinProfile;
  country: string;
  countryCode: string;
  name: string | null;
  administrative: string | null;
  postCode: string | null;
  lat: number;
  lng: number;
  moderation: Moderation;
  moderationFeedback?: string;

  constructor(obj: MapPin) {
    Object.assign(this, obj);
  }
}

export type MapPinFormData = {
  lat: number;
  lng: number;
  country: string;
  countryCode: string;
  administrative: string;
  postCode: string;
  name: string;
};

export interface DBAuthorVotes {
  content_type: string;
  vote_count: number;
}

export class AuthorVotes {
  contentType: string;
  voteCount: number;

  constructor(obj: AuthorVotes) {
    Object.assign(this, obj);
  }

  static fromDB(dbVotes: DBAuthorVotes) {
    return new AuthorVotes({
      contentType: dbVotes.content_type,
      voteCount: dbVotes.vote_count,
    });
  }
}

export type DBPinProfile = Pick<
  DBProfile,
  | 'id'
  | 'display_name'
  | 'username'
  | 'country'
  | 'cover_images'
  | 'photo'
  | 'tags'
  | 'type'
  | 'visitor_policy'
  | 'about'
  | 'is_contactable'
  | 'last_active'
> & { badges: DBProfileBadgeJoin[] };

export type PinProfile = Pick<
  Profile,
  | 'id'
  | 'displayName'
  | 'username'
  | 'country'
  | 'coverImages'
  | 'photo'
  | 'tags'
  | 'type'
  | 'visitorPolicy'
  | 'about'
  | 'isContactable'
  | 'lastActive'
> & { badges: ProfileBadge[] };

export type UpsertPin = Omit<DBMapPin, 'id' | 'profile' | 'moderation' | 'moderation_feedback'>;

export type SubscribedUser = {
  profile_id: number;
  profile_created_at: string;
  email: string;
  is_unsubscribed: boolean;
  replies: boolean;
  comments: boolean;
  research_updates: boolean;
};
