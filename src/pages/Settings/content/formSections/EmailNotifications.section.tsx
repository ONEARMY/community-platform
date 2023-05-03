import * as React from 'react'
import { Heading, Box, Text } from 'theme-ui'
import { FlexSectionContainer } from './elements'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import type { INotificationSettings } from 'src/models/user.models'
import { EmailNotificationFrequency } from 'oa-shared'
import { Field } from 'react-final-form'

interface IProps {
  notificationSettings?: INotificationSettings
}

const emailFrequencyOptions: {
  value: EmailNotificationFrequency
  label: string
}[] = [
  { value: EmailNotificationFrequency.NEVER, label: 'Never' },
  { value: EmailNotificationFrequency.DAILY, label: 'Daily' },
  { value: EmailNotificationFrequency.WEEKLY, label: 'Weekly' },
  { value: EmailNotificationFrequency.MONTHLY, label: 'Monthly' },
]

export const EmailNotificationsSection = observer((props: IProps) => {
  const defaultValue = React.useMemo(
    () =>
      emailFrequencyOptions.find(
        ({ value }) =>
          value ===
          (props.notificationSettings?.emailFrequency ??
            EmailNotificationFrequency.NEVER),
      ),
    [props.notificationSettings?.emailFrequency],
  )
  return (
    <FlexSectionContainer>
      <Heading variant="small">Email notifications (beta)</Heading>
      <Text mt={4} mb={4} sx={{ display: 'block' }}>
        We send an email with all the notifications you've missed. Select how
        often you want to receive this:
      </Text>
      <Box mt={2} sx={{ width: '40%' }}>
        <Field name="notification_settings.emailFrequency">
          {({ input }) => {
            return (
              <Select
                options={emailFrequencyOptions}
                defaultValue={defaultValue}
                onChange={({ value }) => input.onChange(value)}
              />
            )
          }}
        </Field>
      </Box>
    </FlexSectionContainer>
  )
})
