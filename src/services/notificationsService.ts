import { Notification } from 'oa-shared'

export const getNotifications = async () => {
  try {
    const response = await fetch(`/api/notifications`)
    const result = await response.json()

    if (response.ok && result.notifications === null) {
      return []
    }

    const notifications = result.notifications.map((dbNotification) =>
      Notification.fromDB(dbNotification, null),
    )
    return notifications
  } catch (error) {
    console.error({ error })
    return null
  }
}

export const notificationsService = {
  getNotifications,
}
