import type { NotificationType } from 'oa-shared'
import { CONFIG } from '../config/config'
import { INotification } from '../models'
import {
  PP_PROJECT_IMAGE,
  PK_PROJECT_IMAGE,
  PP_PROJECT_NAME,
  PK_PROJECT_NAME,
  PP_SIGNOFF,
  PK_SIGNOFF,
} from './constants'
import { firebaseAuth } from '../Firebase/auth'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB } from '../models'

export const EMAIL_FUNCTION_MEMORY_LIMIT = '512MB'

export const getUserEmail = async (uid: string): Promise<string | null> => {
  try {
    const { email } = await firebaseAuth.getUser(uid)
    return email
  } catch (error) {
    return null
  }
}

export const getUserAndEmail = async (userName: string) => {
  const toUserDoc = (await db
    .collection(DB_ENDPOINTS.users)
    .doc(userName)
    .get()) as FirebaseFirestore.DocumentSnapshot<IUserDB>

  const toUser = toUserDoc.exists ? toUserDoc.data() : undefined
  const toUserEmail = toUser ? await getUserEmail(toUser._authID) : undefined

  if (!toUser || !toUserEmail) {
    throw new Error(`Cannot get user ${userName}`)
  }

  return { toUser, toUserEmail }
}

export const SITE_URL = CONFIG.deployment.site_url

export const getProjectImageSrc = () => {
  switch (SITE_URL) {
    case 'https://dev.onearmy.world':
    case 'https://community.preciousplastic.com':
      return PP_PROJECT_IMAGE
    case 'https://dev.community.projectkamp.com':
    case 'https://community.projectkamp.com':
      return PK_PROJECT_IMAGE
  }
}

export const getProjectName = () => {
  switch (SITE_URL) {
    case 'http://localhost:4000':
    case 'https://dev.onearmy.world':
    case 'https://community.preciousplastic.com':
      return PP_PROJECT_NAME
    case 'https://dev.community.projectkamp.com':
    case 'https://community.projectkamp.com':
      return PK_PROJECT_NAME
  }
}

export const getGreeting = (
  userDisplayName: string,
  greetingMessage: string = '',
) => `
<div align="left" class="greeting-container">
<p>Hey ${userDisplayName}</p>
<p>${greetingMessage}</p>
</div>`

export const getProjectSignoff = () => {
  switch (SITE_URL) {
    case 'https://dev.onearmy.world':
    case 'https://community.preciousplastic.com':
      return PP_SIGNOFF
    case 'https://dev.community.projectkamp.com':
    case 'https://community.projectkamp.com':
      return PK_SIGNOFF
  }
}

export const getUserLink = (displayName: string, userName: string) =>
  `<a href='${SITE_URL}/u/${userName}'>${displayName}</a>`

const HOWTO_NOTIFICATIONS: NotificationType[] = [
  'new_comment',
  'howto_useful',
  'howto_mention',
  'howto_approved',
  'howto_needs_updates',
]
const RESEARCH_NOTIFICATIONS = [
  'new_comment_research',
  'research_useful',
  'research_mention',
  'research_update',
  'research_approved',
  'research_needs_updates',
]
const MAP_PIN_NOTIFICATIONS = ['map_pin_approved', 'map_pin_needs_updates']

const getResourceLabel = (type: NotificationType) => {
  if (HOWTO_NOTIFICATIONS.includes(type)) {
    return 'how-to'
  }
  if (RESEARCH_NOTIFICATIONS.includes(type)) {
    return 'research'
  }
  if (MAP_PIN_NOTIFICATIONS.includes(type)) {
    return 'map pin'
  }
  return 'item'
}

const getResourceLink = (
  notificationType: NotificationType,
  relevantUrl: string,
) =>
  `<a href='${SITE_URL}${relevantUrl}'>${getResourceLabel(
    notificationType,
  )}</a>`

const getCommentListItem = (notification: INotification) => `
<p>
    New comment on your ${getResourceLink(
      notification.type,
      notification.relevantUrl,
    )} by ${getUserLink(
  notification.triggeredBy.displayName,
  notification.triggeredBy.userId,
)}
</p>`

const getMentionListItem = (notification: INotification) => `
<p>
  ${getUserLink(
    notification.triggeredBy.displayName,
    notification.triggeredBy.userId,
  )} mentioned you in this ${getResourceLink(
  notification.type,
  notification.relevantUrl,
)}
</p>`

const getUsefulListItem = (notification: INotification) => `
<p>
    ${getUserLink(
      notification.triggeredBy.displayName,
      notification.triggeredBy.userId,
    )} found your ${getResourceLink(
  notification.type,
  notification.relevantUrl,
)}
useful
</p>
`

const getUpdateListItem = (notification: INotification) => `
<p>
    ${getUserLink(
      notification.triggeredBy.displayName,
      notification.triggeredBy.userId,
    )} posted an update to this ${getResourceLink(
  notification.type,
  notification.relevantUrl,
)}
you follow
</p>
`

const getModerationApprovedListItem = (notification: INotification) => `
<p>
    Your ${getResourceLink(
      notification.type,
      notification.relevantUrl,
    )} has been approved
</p>`

const getModerationRejectedListItem = (notification: INotification) => `
<p>
    Your ${getResourceLink(
      notification.type,
      notification.relevantUrl,
    )} needs updates
</p>`

const isCommentNotification = (notification: INotification) =>
  ['new_comment_research', 'new_comment'].includes(notification.type)

const isMentionNotification = (notification: INotification) =>
  ['research_mention', 'howto_mention'].includes(notification.type)

const isUsefulNotification = (notification: INotification) =>
  ['research_useful', 'howto_useful'].includes(notification.type)

const isUpdateNotification = (notification: INotification) =>
  notification.type === 'research_update'

const isModerationApprovedNotification = (notification: INotification) =>
  ['howto_approved', 'map_pin_approved', 'research_approved'].includes(
    notification.type,
  )

const isModerationRejectedNotification = (notification: INotification) =>
  [
    'howto_needs_updates',
    'map_pin_needs_updates',
    'research_needs_updates',
  ].includes(notification.type)

export const getNotificationListItem = (
  notification: INotification,
): string => {
  if (isCommentNotification(notification)) {
    return getCommentListItem(notification)
  }
  if (isMentionNotification(notification)) {
    return getMentionListItem(notification)
  }
  if (isUsefulNotification(notification)) {
    return getUsefulListItem(notification)
  }
  if (isUpdateNotification(notification)) {
    return getUpdateListItem(notification)
  }
  if (isModerationApprovedNotification(notification)) {
    return getModerationApprovedListItem(notification)
  }
  if (isModerationRejectedNotification(notification)) {
    return getModerationRejectedListItem(notification)
  }
}
