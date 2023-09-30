import * as React from 'react'
import { Heading, Box, Text } from 'theme-ui'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import { EmailNotificationFrequency } from 'oa-shared'
import { Field } from 'react-final-form'

import { FlexSectionContainer } from './elements'
import { fields } from 'src/pages/UserSettings/labels'

import type { INotificationSettings } from 'src/models/user.models'

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
  const { description, title } = fields.emailNotifications
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
      <Heading variant="small">{title}</Heading>
      <Text mt={4} mb={4} sx={{ display: 'block' }}>
        {`${description}:`}
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
