import { useState } from 'react'
import { Form } from 'react-final-form'
import { Loader } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import {
  buttons,
  fields,
  notificationForm,
} from 'src/pages/UserSettings/labels'
import { Button, Flex, Heading, Text } from 'theme-ui'

import { EmailNotificationsSection } from './content/sections/EmailNotifications.section'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'

import type { IFormNotification } from './content/SettingsFormNotifications'

export const SettingsPageNotifications = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)

  const { userStore } = useCommonStores().stores
  const user = userStore.activeUser
  const { description, title } = fields.emailNotifications

  const formId = 'Notifications'

  const onSubmit = async ({ notification_settings }) => {
    setIsLoading(true)
    try {
      const updatingUser = {
        ...user,
        notification_settings,
      }
      await userStore.updateUserNotificationSettings(updatingUser)

      setNotification({
        message: notificationForm.succesfulSave,
        icon: 'check',
        show: true,
        variant: 'success',
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

  const initialValues = {
    notification_settings: user.notification_settings || undefined,
  }

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 4,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Heading as="h2" variant="small">
          {title}
        </Heading>
        <Text variant="quiet">{description}</Text>
      </Flex>

      <Form
        id={formId}
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({
          errors,
          submitFailed,
          submitting,
          handleSubmit,
          values,
        }) => {
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
    </Flex>
  )
}
