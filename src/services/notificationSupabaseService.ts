import type { Notification } from 'oa-shared'

const getNotifications = async () => {
  try {
    const response = await fetch('/api/notifications')
    const result = (await response.json()) as { notifications: Notification[] }

    return result.notifications
  } catch (error) {
    console.error(error)
  }
  return []
}

export const notificationSupabaseService = {
  getNotifications,
}
