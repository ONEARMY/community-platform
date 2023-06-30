import { NotificationType } from '../../../src/models'
import { CONFIG } from '../config/config'
import { INotification } from '../models'
import {
  PP_PROJECT_IMAGE,
  PK_PROJECT_IMAGE,
  PP_PROJECT_NAME,
  PK_PROJECT_NAME,
} from './consts'

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

export const getCommentListItem = (notification: INotification) => `
<p>
    New comment on your ${getResourceLink(
      notification.type,
      notification.relevantUrl,
    )} by ${getUserLink(
  notification.triggeredBy.displayName,
  notification.triggeredBy.userName,
)}
</p>`

export const getMentionListItem = (notification: INotification) => `
<p>
  ${getUserLink(
    notification.triggeredBy.displayName,
    notification.triggeredBy.userName,
  )} mentioned you in this ${getResourceLink(
  notification.type,
  notification.relevantUrl,
)}
</p>`

export const getUsefulListItem = (notification: INotification) => `
<p>
    ${getUserLink(
      notification.triggeredBy.displayName,
      notification.triggeredBy.userName,
    )} found your ${getResourceLink(
  notification.type,
  notification.relevantUrl,
)}
useful
</p>
`

export const isCommentNotification = (notification: INotification) =>
  ['new_comment_research', 'new_comment'].includes(notification.type)

export const isMentionNotification = (notification: INotification) =>
  ['research_mention', 'howto_mention'].includes(notification.type)

export const isUsefulNotification = (notification: INotification) =>
  ['research_useful', 'howto_useful'].includes(notification.type)
