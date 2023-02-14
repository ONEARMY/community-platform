import type { UserNotificationList } from 'oa-components'
import { InternalLink } from 'oa-components'
import type { INotification } from 'src/models'
import type { UserNotificationsStore } from 'src/stores/User/notifications.store'
import { Box } from 'theme-ui'

export function getFormattedNotificationMessage(notification: INotification) {
  switch (notification.type) {
    case 'new_comment':
      return (
        <Box>
          New comment on your
          <InternalLink to={notification.relevantUrl || ''}>
            how-to
          </InternalLink>
          by
          <InternalLink to={'/u/' + notification.triggeredBy.userId}>
            {notification.triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    case 'howto_mention':
      return (
        <Box>
          You were mentioned in a
          <InternalLink to={notification.relevantUrl || ''}>
            how-to
          </InternalLink>
          by
          <InternalLink to={'/u/' + notification.triggeredBy.userId}>
            {notification.triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    case 'howto_useful':
      return (
        <Box>
          Yay,
          <InternalLink to={'/u/' + notification.triggeredBy.userId}>
            {notification.triggeredBy.displayName}
          </InternalLink>
          found your
          <InternalLink to={notification.relevantUrl || ''}>
            how-to
          </InternalLink>
          useful
        </Box>
      )
    case 'research_useful':
      return (
        <Box>
          Yay,
          <InternalLink to={'/u/' + notification.triggeredBy.userId}>
            {notification.triggeredBy.displayName}
          </InternalLink>
          found your
          <InternalLink to={notification.relevantUrl || ''}>
            research
          </InternalLink>
          useful
        </Box>
      )
    case 'new_comment_research':
      return (
        <Box>
          New comment on your
          <InternalLink to={notification.relevantUrl || ''}>
            research
          </InternalLink>
          by
          <InternalLink to={'/u/' + notification.triggeredBy.userId}>
            {notification.triggeredBy.displayName}
          </InternalLink>
        </Box>
      )
    default:
      return <></>
      break
  }
}

export function getFormattedNotifications(
  userNotificationsStore: UserNotificationsStore,
): UserNotificationList {
  return userNotificationsStore
    .getUnreadNotifications()
    .map((notification) => ({
      type: notification.type,
      children: getFormattedNotificationMessage(notification),
    }))
}
