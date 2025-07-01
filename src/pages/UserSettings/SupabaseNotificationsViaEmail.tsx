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
  if (!userCode) return null

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [initialValues, setInitialValues] =
    useState<DBNotificationsPreferences | null>(null)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const getPreferences = async () => {
    const preferences =
      await notificationsPreferencesViaEmailService.getPreferences(userCode)

    setInitialValues(preferences)
    setIsLoading(false)
  }

  useEffect(() => {
    getPreferences()
  }, [])

  const onSubmit = async (values: DBNotificationsPreferences) => {
    setIsLoading(true)
    setSubmitResults(null)

    try {
      await notificationsPreferencesViaEmailService.setPreferences({
        ...values,
        userCode,
      })
      await getPreferences()
      setSubmitResults({
        type: 'success',
        message: form.saveNotificationPreferences,
      })
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  return (
    <SupabaseNotificationsForm
      initialValues={initialValues}
      isLoading={isLoading}
      onSubmit={onSubmit}
      submitResults={submitResults}
    />
  )
}
