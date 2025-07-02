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

  return fetch(`/api/notifications-preferences-via-email/${data.userCode}`, {
    method: 'POST',
    body: formData,
  })
}

export const notificationsPreferencesViaEmailService = {
  getPreferences,
  setPreferences,
}
