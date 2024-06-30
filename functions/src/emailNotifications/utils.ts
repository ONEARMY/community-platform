import { CONFIG } from '../config/config'
import { firebaseAuth } from '../Firebase/auth'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import {
  PK_PROJECT_IMAGE,
  PK_PROJECT_NAME,
  PK_SIGNOFF,
  PP_PROJECT_IMAGE,
  PP_PROJECT_NAME,
  PP_SIGNOFF,
} from './constants'

import type { NotificationType } from '@onearmy.apps/shared'
import type { IMessageDB, INotification, IUserDB } from '../models'

export const errors = {
  MESSAGE_LIMIT:
    'Emailing of new message blocked: User exceeded email message count',
  NO_ATTACHED_USER:
    'Emailing of new message blocked: Email address not attached to user record',
  PROFILE_NOT_CONTACTABLE:
    'Emailing of new message blocked: Profile not contactable',
  USER_BLOCKED: 'Emailing of new message blocked: User blocked from messaging',
}
const EMAIL_ADDRESS_SEND_LIMIT = 100

export const getUserEmail = async (uid: string): Promise<string | null> => {
  try {
    const { email } = await firebaseAuth.getUser(uid)
    return email
  } catch (error) {
    return null
  }
}

export const getUserAndEmail = async (userName: string) => {
  if (!userName) {
    throw new Error('Cannot get email for empty user name')
  }
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

export const isBelowMessageLimit = async (email) => {
  const { docs } = await db
    .collection(DB_ENDPOINTS.messages)
    .where('email', '==', email)
    .get()
  if (docs.length >= EMAIL_ADDRESS_SEND_LIMIT) {
    throw new Error(errors.MESSAGE_LIMIT)
  }
  return true
}

export const isReceiverContactable = async (userName) => {
  const { toUser } = await getUserAndEmail(userName)
  if (
    typeof toUser.isContactableByPublic === 'boolean' &&
    !toUser.isContactableByPublic
  ) {
    throw new Error(errors.PROFILE_NOT_CONTACTABLE)
  }
  return true
}

export const isSameEmail = (userDoc, email) => {
  if (userDoc.email !== email) {
    throw new Error(errors.NO_ATTACHED_USER)
  }
  return true
}

export const isUserAllowedToMessage = async (uid) => {
  const { docs } = await db
    .collection(DB_ENDPOINTS.users)
    .where('_authID', '==', uid)
    .limit(1)
    .get()

  if (!docs[0]) {
    throw new Error(`Cannot get user ${uid}`)
  }

  if (docs[0].data().isBlockedFromMessaging) {
    throw new Error(errors.USER_BLOCKED)
  }
  return true
}

export const isValidMessageRequest = async ({
  email,
  toUserName,
}: IMessageDB) => {
  const userDoc = await firebaseAuth.getUserByEmail(email)

  try {
    isSameEmail(userDoc, email)
    await isUserAllowedToMessage(userDoc.uid)
    await isBelowMessageLimit(email)
    await isReceiverContactable(toUserName)
    return true
  } catch (error) {
    throw error
  }
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
  New comment by ${getUserLink(
    notification.triggeredBy.displayName,
    notification.triggeredBy.userId,
  )} on <a href='${SITE_URL}${notification.relevantUrl}'>${
    notification.title
  }</a>
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
  ['new_comment_research', 'new_comment', 'new_comment_discussion'].includes(
    notification.type,
  )

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
