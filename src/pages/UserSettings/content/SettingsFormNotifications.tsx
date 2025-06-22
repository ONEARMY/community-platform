import { TextNotification } from 'oa-components'
import { ErrorsContainer } from 'src/common/Form/ErrorsContainer'
import { Text } from 'theme-ui'

export type IFormNotification = {
  message: string
  icon: string
  show: boolean
  variant: 'success' | 'failure'
}

type SettingsFormNotificationsProps = {
  notification?: IFormNotification
  submitFailed: boolean
  errors:
    | {
        [key: string]: any
      }
    | undefined
}

export const SettingsFormNotifications = ({
  errors,
  notification,
  submitFailed,
}: SettingsFormNotificationsProps) => {
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
        <ErrorsContainer
          errors={Object.values(errors).map((value) => String(value))}
        />
      )}
    </>
  )
}
