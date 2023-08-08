import type { UserNotificationList } from 'oa-components'
import { InternalLink } from 'oa-components'
import type { INotification } from 'src/models'
import { Box } from 'theme-ui'

export const getFormattedNotificationMessage = (
  notification: INotification,
) => {
  // Some legacy notifications to not have trigger, workaround until data cleaned and caches updated
  const triggeredBy = notification.triggeredBy || {
    displayName: 'Anonymous',
    userId: '',
  }
  const relevantUrl = notification.relevantUrl || ''
  switch (notification.type) {
    case 'new_comment':
      return (
        <Box>
          New comment on your
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          by
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    case 'howto_mention':
      return (
        <Box>
          You were mentioned in a
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          by
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    case 'howto_useful':
      return (
        <Box>
          Yay,
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          found your
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          useful
        </Box>
      )
    case 'howto_approved':
      return (
        <Box>
          Yay, your
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          has been approved
        </Box>
      )
    case 'howto_needs_updates':
      return (
        <Box>
          Your
          <InternalLink to={relevantUrl}>how-to</InternalLink>
          needs some updates before we can approve it
        </Box>
      )
    case 'map_pin_approved':
      return (
        <Box>
          Yay, your
          <InternalLink to={relevantUrl}>map pin</InternalLink>
          has been approved
        </Box>
      )
    case 'map_pin_needs_updates':
      return (
        <Box>
          Your
          <InternalLink to={relevantUrl}>map pin</InternalLink>
          needs some updates before we can approve it
        </Box>
      )
    case 'research_useful':
      return (
        <Box>
          Yay,
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          found your
          <InternalLink to={relevantUrl}>research</InternalLink>
          useful
        </Box>
      )
    case 'research_mention':
      return (
        <Box>
          You were mentioned in a
          <InternalLink to={relevantUrl}>research article</InternalLink>
          by
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    case 'research_update':
      return (
        <Box>
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
          posted an update to this
          <InternalLink to={relevantUrl}>research</InternalLink>
          you follow
        </Box>
      )
    case 'research_approved':
      return (
        <Box>
          Yay, your
          <InternalLink to={relevantUrl}>research</InternalLink>
          has been approved
        </Box>
      )
    case 'research_needs_updates':
      return (
        <Box>
          Your
          <InternalLink to={relevantUrl}>research</InternalLink>
          needs some updates before we can approve it
        </Box>
      )
    case 'new_comment_research':
      return (
        <Box>
          New comment on your
          <InternalLink to={relevantUrl}>research</InternalLink>
          by
          <InternalLink to={'/u/' + triggeredBy.userId}>
            {triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    default:
      return <></>
      break
  }
}

export const getFormattedNotifications = (
  notificationList: INotification[],
): UserNotificationList =>
  notificationList.map((notification) => ({
    type: notification.type,
    children: getFormattedNotificationMessage(notification),
  }))
