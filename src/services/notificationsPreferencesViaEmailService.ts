import type {
  DBNotificationsPreferences,
  NotificationsPreferencesViaEmailFormData,
} from 'oa-shared'

const getPreferences = async (
  userCode: string,
): Promise<DBNotificationsPreferences | null> => {
  try {
    const preferencesData = await fetch(
      `/api/notifications-preferences-via-email/${userCode}`,
    )
    const { preferences } = await preferencesData.json()
    return preferences
  } catch (err) {
    console.error(err)
  }

  return null
}

const setPreferences = async (
  data: NotificationsPreferencesViaEmailFormData,
) => {
  const formData = new FormData()

  formData.append('comments', data.comments.toString())
  formData.append('replies', data.replies.toString())
  formData.append('research_updates', data.research_updates.toString())
  formData.append('is_unsubscribed', 'false')

  return fetch(`/api/notifications-preferences-via-email/${data.userCode}`, {
    method: 'POST',
    body: formData,
  })
}

const setUnsubscribe = async (userCode: string, id: number | undefined) => {
  const formData = new FormData()

  id && formData.append('id', id.toString())
  formData.append('comments', 'false')
  formData.append('replies', 'false')
  formData.append('research_updates', 'false')
  formData.append('is_unsubscribed', 'true')

  return fetch(`/api/notifications-preferences-via-email/${userCode}`, {
    method: 'POST',
    body: formData,
  })
}

export const notificationsPreferencesViaEmailService = {
  getPreferences,
  setPreferences,
  setUnsubscribe,
}
