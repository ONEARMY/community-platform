import { useEffect, useState } from 'react'
import { form } from 'src/pages/UserSettings/labels'
import { notificationsPreferencesService } from 'src/services/notificationsPreferencesService'
import { useProfileStore } from 'src/stores/User/profile.store'

import { SupabaseNotificationsForm } from './SupabaseNotificationsForm'

import type { DBNotificationsPreferences } from 'oa-shared'
import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

export const SupabaseNotifications = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [initialValues, setInitialValues] =
    useState<DBNotificationsPreferences | null>(null)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const { profile } = useProfileStore()
  const hasMessagingOn =
    profile?.isContactable === undefined ? true : profile?.isContactable

  const refreshPreferences = async () => {
    const preferences = await notificationsPreferencesService.getPreferences()
    setInitialValues(preferences)
    setIsLoading(false)
  }

  useEffect(() => {
    refreshPreferences()
  }, [])

  const onSubmit = async (values: DBNotificationsPreferences) => {
    setIsLoading(true)
    setSubmitResults(null)

    try {
      await notificationsPreferencesService.setPreferences(values)
      await refreshPreferences()
      setSubmitResults({
        type: 'success',
        message: form.saveNotificationPreferences,
      })
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  const onUnsubscribe = async () => {
    setIsLoading(true)
    setSubmitResults(null)

    try {
      await notificationsPreferencesService.setUnsubscribe(initialValues?.id)
      await refreshPreferences()
      setSubmitResults({
        type: 'success',
        message: form.saveNotificationPreferences,
      })
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  if (!profile) return null

  return (
    <SupabaseNotificationsForm
      initialValues={initialValues}
      isLoading={isLoading}
      hasMessagingOn={hasMessagingOn}
      onSubmit={onSubmit}
      onUnsubscribe={onUnsubscribe}
      submitResults={submitResults}
    />
  )
}
