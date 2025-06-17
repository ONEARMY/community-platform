import type {
  DBNotificationsPreferences,
  NotificationsPreferencesFormData,
} from 'oa-shared'

const getPreferences = async (): Promise<DBNotificationsPreferences | null> => {
  try {
    const preferencesData = await fetch('/api/notifications-preferences')
    const { preferences } = await preferencesData.json()
    return preferences
  } catch (err) {
    console.error(err)
  }

  return null
}

const setPreferences = async (data: NotificationsPreferencesFormData) => {
  const formData = new FormData()

  data.id && formData.append('id', data.id.toString())
  formData.append('comments', data.comments.toString())
  formData.append('replies', data.replies.toString())
  formData.append('research_updates', data.replies.toString())

  return fetch('/api/notifications-preferences', {
    method: 'POST',
    body: formData,
  })
}

export const notificationsPreferencesService = {
  getPreferences,
  setPreferences,
}
