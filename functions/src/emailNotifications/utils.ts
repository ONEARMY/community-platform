import type { NotificationType } from 'oa-shared'
import { CONFIG } from '../config/config'
import { INotification } from '../models'
import {
  PP_PROJECT_IMAGE,
  PK_PROJECT_IMAGE,
  PP_PROJECT_NAME,
  PK_PROJECT_NAME,
} from './constants'

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
    case 'https://dev.onearmy.world':
    case 'https://community.preciousplastic.com':
      return PP_PROJECT_NAME
    case 'https://dev.community.projectkamp.com':
    case 'https://community.projectkamp.com':
      return PK_PROJECT_NAME
  }
}

export const getUserLink = (displayName: string, userName: string) =>
  `<a href='${SITE_URL}/u/${userName}'>${displayName}</a>`

export const getResourceLink = (
  notificationType: NotificationType,
  relevantUrl: string,
) => {
  let resourceLabel: string
  switch (notificationType) {
    case 'new_comment':
    case 'howto_useful':
    case 'howto_mention':
      resourceLabel = 'how-to'
    case 'new_comment_research':
    case 'research_useful':
    case 'research_mention':
    case 'research_update':
      resourceLabel = 'research'
  }
  return `<a href='${SITE_URL}${relevantUrl}'>${resourceLabel}</a>`
}

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

const isCommentNotification = (notification: INotification) =>
  ['new_comment_research', 'new_comment'].includes(notification.type)

const isMentionNotification = (notification: INotification) =>
  ['research_mention', 'howto_mention'].includes(notification.type)

const isUsefulNotification = (notification: INotification) =>
  ['research_useful', 'howto_useful'].includes(notification.type)

const isUpdateNotification = (notification: INotification) =>
  notification.type === 'research_update'

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
}
