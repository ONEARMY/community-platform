import { Box, Text } from 'theme-ui'

import type { Notification } from 'oa-shared'

export interface IProps {
  notifications: Notification[]
}

export const NotificationListSupabase = (props: IProps) => {
  const { notifications } = props

  return notifications.map((notification, index) => {
    return (
      <Box key={index}>
        <Text>{notification.actionType}</Text>
        <Text>{notification.contentType}</Text>
      </Box>
    )
  })
}
