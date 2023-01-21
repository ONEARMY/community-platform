import * as React from 'react'
import { Heading, Box, Text } from 'theme-ui'
import { FlexSectionContainer } from './elements'
import { observer, inject } from 'mobx-react'
import { Select } from 'oa-components'
import type { INotificationSettings } from 'src/models/user.models'
import { EmailNotificationFrequency } from 'src/models/user.models'
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

@inject('userStore')
@observer
export class EmailNotificationsSection extends React.Component<any> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    return (
      <FlexSectionContainer>
        <Heading variant="small">Email notifications</Heading>
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
                  defaultValue={emailFrequencyOptions.find(
                    ({ value }) =>
                      value ===
                        this.props.notificationSettings?.emailFrequency ??
                      EmailNotificationFrequency.NEVER,
                  )}
                  onChange={({ value }) => input.onChange(value)}
                />
              )
            }}
          </Field>
        </Box>
      </FlexSectionContainer>
    )
  }
}
