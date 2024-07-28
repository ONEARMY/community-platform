import { TextNotification } from 'oa-components'
import { Text } from 'theme-ui'

import { SettingsErrors } from './SettingsErrors'

export type IFormNotification = {
  message: string
  icon: string
  show: boolean
  variant: 'success' | 'failure'
}

export const SettingsFormNotifications = ({
  errors,
  notification,
  submitFailed,
}) => {
  const showSuccessNotification =
    notification &&
    notification.show &&
    (!errors || Object.keys(errors).length === 0)
  const showErrorsNotification = errors && submitFailed

  return (
    <>
      {showSuccessNotification && (
        <TextNotification
          isVisible={notification.show}
          variant={notification.variant}
        >
          <Text>{notification.message}</Text>
        </TextNotification>
      )}
      {showErrorsNotification && (
        <SettingsErrors
          errors={errors}
          isVisible={!!(errors && Object.keys(errors).length > 0)}
        />
      )}
    </>
  )
}
