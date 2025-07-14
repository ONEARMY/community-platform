import { useEffect, useState } from 'react'
import { form } from 'src/pages/UserSettings/labels'
import { notificationsPreferencesViaEmailService } from 'src/services/notificationsPreferencesViaEmailService'

import { SupabaseNotificationsForm } from './SupabaseNotificationsForm'

import type { DBNotificationsPreferences } from 'oa-shared'
import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

interface IProps {
  userCode: string
}

export const SupabaseNotificationsViaEmail = ({ userCode }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [initialValues, setInitialValues] =
    useState<DBNotificationsPreferences | null>(null)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const refreshPreferences = async () => {
    const preferences =
      await notificationsPreferencesViaEmailService.getPreferences(userCode)

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
      await notificationsPreferencesViaEmailService.setPreferences({
        ...values,
        userCode,
      })
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
      await notificationsPreferencesViaEmailService.setUnsubscribe(
        userCode,
        initialValues?.id,
      )
      await refreshPreferences()
      setSubmitResults({
        type: 'success',
        message: form.saveNotificationPreferences,
      })
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  if (!userCode) return null

  return (
    <SupabaseNotificationsForm
      initialValues={initialValues}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onUnsubscribe={onUnsubscribe}
      submitResults={submitResults}
    />
  )
}
