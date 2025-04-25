import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { fields, visitorPolicyLabels } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Switch, Text } from 'theme-ui'
import { Select } from 'oa-components'

import { IUser, UserVisitorPreferenceStatus } from 'oa-shared'
import * as React from 'react'

interface Props {
  openToVisitors: IUser['openToVisitors']
}

type PolicyOption = {
  value: UserVisitorPreferenceStatus
  label: string
}

// TODO can be better with enum
const defaultPolicy: PolicyOption = { value: 'open', label: visitorPolicyLabels.open }
const visitorPolicyOptions: PolicyOption[] = [
  defaultPolicy,
  { value: 'appointment', label: visitorPolicyLabels.appointment },
  { value: 'closed', label: visitorPolicyLabels.closed },
]

export const VisitorSection = observer((props: Props) => {
  const { openToVisitors } = props
  const { title, description, placeholder: switchLabel } = fields.visitorPreference
  const name = 'openToVisitors'

  console.log(openToVisitors)

  return (
    <Flex
      data-testid="VisitorSection"
      data-cy="VisitorSection"
      sx={{
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Heading as="h2">{title}</Heading>
      <Text variant="quiet" sx={{ fontSize: 2 }}>
        {description}
      </Text>
      <Field name={name}>
        {({ input }) => {
          return <Switch
            checked={!!openToVisitors}
            data-cy={`${name}-${openToVisitors}`}
            data-testid={`${name}-switch`}
            label={switchLabel}
            onChange={() => input.onChange(openToVisitors ? null : 'open')}
            sx={{
              'input:checked ~ &': {
                backgroundColor: 'green',
              },
            }}
          />
        }}
      </Field>
      {openToVisitors && <Field name="openToVisitors">
        {({ input }) => {
          return (
            <Select
              options={visitorPolicyOptions}
              defaultValue={defaultPolicy}
              onChange={({ value }) => input.onChange(value)}
            />
          )
        }}
      </Field>
      }
    </Flex>
  )
})
