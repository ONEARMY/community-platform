import { useState } from 'react'
import { Form } from 'react-final-form'
import { Loader } from 'oa-components'
import { EmailNotificationFrequency } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { buttons, notificationForm } from 'src/pages/UserSettings/labels'
import { Button } from 'theme-ui'

import { EmailNotificationsSection } from './content/sections/EmailNotifications.section'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'

import type { IFormNotification } from './content/SettingsFormNotifications'

export const FirebaseNotifications = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)

  const { userStore } = useCommonStores().stores
  const user = userStore.activeUser

  const formId = 'Notifications'

  const onSubmit = async ({ notification_settings }) => {
    setIsLoading(true)
    try {
      const updatingUser = {
        ...user,
        notification_settings,
      }
      const updatedUser =
        await userStore.updateUserNotificationSettings(updatingUser)

      setNotification({
        message: notificationForm.successfulSave,
        icon: 'check',
        show: true,
        variant: 'success',
      })
      setInitialValues({
        notification_settings: {
          ...updatedUser.notification_settings,
          emailFrequency,
        },
      })
    } catch (error) {
      setNotification({
        message: `Save Failed - ${error.message} `,
        icon: 'close',
        show: true,
        variant: 'failure',
      })
    }
    setIsLoading(false)
  }

  if (!user) return null

  const isUnsubscribed = !!user.unsubscribeToken
  const emailFrequency = isUnsubscribed
    ? EmailNotificationFrequency.NEVER
    : user.notification_settings?.emailFrequency

  const [initialValues, setInitialValues] = useState({
    notification_settings: {
      ...user.notification_settings,
      emailFrequency,
    },
  })

  return (
    <Form
      id={formId}
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ errors, submitFailed, submitting, handleSubmit, values }) => {
        if (isLoading)
          return (
            <Loader
              label={notificationForm.loading}
              sx={{ alignSelf: 'center' }}
            />
          )

        return (
          <>
            <SettingsFormNotifications
              errors={errors}
              notification={notification}
              submitFailed={submitFailed}
            />

            <EmailNotificationsSection
              notificationSettings={values.notification_settings}
            />

            <Button
              type="submit"
              form={formId}
              data-cy="save-notification-settings"
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ alignSelf: 'flex-start' }}
            >
              {buttons.notifications}
            </Button>
          </>
        )
      }}
    />
  )
}
