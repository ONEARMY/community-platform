import type {
  DBPreferencesWithProfileContact,
  NotificationsPreferencesViaEmailFormData,
} from 'oa-shared'

const getPreferences = async (
  userCode: string,
): Promise<DBPreferencesWithProfileContact | null> => {
  try {
    const response = await fetch(
      `/api/notifications-preferences-via-email/${userCode}`,
    )

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`)
      return null
    }

    const { preferences, is_contactable } = await response.json()
    return { preferences, is_contactable }
  } catch (err) {
    console.error(err)
    return null
  }
}

const setPreferences = async (
  data: NotificationsPreferencesViaEmailFormData,
): Promise<Response> => {
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

const setUnsubscribe = async (
  userCode: string,
  id?: number,
): Promise<Response> => {
  const formData = new FormData()
  if (id) {
    formData.append('id', id.toString())
  }
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
