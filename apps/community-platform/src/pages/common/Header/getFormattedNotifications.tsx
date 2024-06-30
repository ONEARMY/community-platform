import { InternalLink } from '@onearmy.apps/components'
import { Box } from 'theme-ui'

import type { INotification } from '../../../models'

export const getFormattedNotificationMessage = (
  notification: INotification,
) => {
  // Some legacy notifications to not have trigger, workaround until data cleaned and caches updated
  const triggeredBy = notification.triggeredBy || {
    displayName: 'Anonymous',
    userId: '',
  }
  const relevantUrl = notification.relevantUrl || ''
  const relevantTitle = notification.title || ''
  switch (notification.type) {
    // legacy format, should use new_comment_discussion
    case 'new_comment':
      return (
        <Box>
          {'New comment on your '}
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          {' by '}
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    case 'howto_mention':
      return (
        <Box>
          {'You were mentioned in a '}
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          {' by '}
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    case 'howto_useful':
      return (
        <Box>
          {'Yay, '}
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          {' found your '}
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          {' useful'}
        </Box>
      )
    case 'howto_approved':
      return (
        <Box>
          {'Yay, your '}
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          {' has been approved'}
        </Box>
      )
    case 'howto_needs_updates':
      return (
        <Box>
          {'Your '}
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          {' needs some updates before we can approve it'}
        </Box>
      )
    case 'map_pin_approved':
      return (
        <Box>
          {'Yay, your '}
          <InternalLink to={relevantUrl}>map pin</InternalLink>
          {' has been approved'}
        </Box>
      )
    case 'map_pin_needs_updates':
      return (
        <Box>
          {'Your '}
          <InternalLink to={relevantUrl}>map pin</InternalLink>
          {' needs some updates before we can approve it'}
        </Box>
      )
    case 'research_useful':
      return (
        <Box>
          {'Yay, '}
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          {' found '}
          <InternalLink to={relevantUrl}>{relevantTitle}</InternalLink>
          {' useful'}
        </Box>
      )
    case 'research_mention':
      return (
        <Box>
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          {' mentioned you in this research '}
          <InternalLink to={relevantUrl}>{relevantTitle}</InternalLink>
        </Box>
      )
    case 'research_update':
      return (
        <Box>
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          {' posted an update to this research '}
          <InternalLink to={relevantUrl}>{relevantTitle}</InternalLink>
          {' you follow'}
        </Box>
      )
    case 'research_approved':
      return (
        <Box>
          {'Yay, your research '}
          <InternalLink to={relevantUrl}>{relevantTitle}</InternalLink>
          {' has been approved'}
        </Box>
      )
    case 'research_needs_updates':
      return (
        <Box>
          {'Your research '}
          <InternalLink to={relevantUrl}>{relevantTitle}</InternalLink>
          {' needs some updates before we can approve it'}
        </Box>
      )
    // legacy format, should use new_comment_discussion
    case 'new_comment_research':
      return (
        <Box>
          {'New comment from '}
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          {' on your research '}
          <InternalLink to={relevantUrl}>{relevantTitle}</InternalLink>
        </Box>
      )
    case 'new_comment_discussion':
      return (
        <Box>
          {'New comment from '}
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          {' on '}
          <InternalLink to={relevantUrl}> {relevantTitle}</InternalLink>
        </Box>
      )
    default:
      return <></>
  }
}

export const getFormattedNotifications = (notificationList: INotification[]) =>
  notificationList.map((notification) => ({
    type: notification.type,
    children: getFormattedNotificationMessage(notification),
  }))
