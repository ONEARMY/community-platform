import * as React from 'react'
import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { FieldTextarea, Select } from 'oa-components'
import {
  fields,
  headings,
  visitorPolicyLabels,
} from 'src/pages/UserSettings/labels'
import { Flex, Heading, Switch, Text } from 'theme-ui'

import type { IUser, UserVisitorPreferencePolicy } from 'oa-shared'

interface Props {
  openToVisitors: IUser['openToVisitors']
}

const visitorPolicyOptions: {
  value: UserVisitorPreferencePolicy
  label: string
}[] = [
  { value: 'open', label: visitorPolicyLabels.open },
  { value: 'appointment', label: visitorPolicyLabels.appointment },
  { value: 'closed', label: visitorPolicyLabels.closed },
]

function findPolicy(policyValue: UserVisitorPreferencePolicy) {
  return visitorPolicyOptions.find(({ value }) => value === policyValue)
}

export const VisitorSection = observer((props: Props) => {
  const { openToVisitors } = props
  const { title: preferenceTitle, description: preferenceDescription } = fields.visitorPreference
  const { title: policyTitle } = fields.visitorPolicy
  const { title: policyDetailsTitle, placeholder: policyDetailsPlaceholder } = fields.visitorDetails
  const { visitors } = headings
  const name = 'openToVisitors'

  return (
    <Flex
      data-testid="VisitorSection"
      data-cy="VisitorSection"
      sx={{
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Heading as="h2">{visitors}</Heading>
      <Text variant="quiet" sx={{ fontSize: 2 }}>
        {preferenceDescription}
      </Text>
      <Field name={name}>
        {({ input }) => {
          return <Switch
            checked={!!openToVisitors}
            data-cy={`${name}-${openToVisitors?.policy || 'not-shown'}`}
            data-testid={`${name}-switch`}
            label={preferenceTitle}
            onChange={() => input.onChange(openToVisitors ? null : { policy: 'open' })}
            sx={{
              'input:checked ~ &': {
                backgroundColor: 'green',
              },
            }}
          />
        }}
      </Field>
      {openToVisitors && <>
        <Text>{policyTitle} *</Text>
        <Field name="openToVisitors.policy">
          {({ input }) => {
            return <Select
                options={visitorPolicyOptions}
                defaultValue={findPolicy(openToVisitors.policy || 'open')}
                onChange={({ value }) => input.onChange(value)}
              />
          }}
        </Field>
        <Text>{policyDetailsTitle}</Text>
        <Field name="openToVisitors.details">
          {({ input }) => {
            return (
              <FieldTextarea
                input={input}
                meta={''}
                value={openToVisitors.details}
                placeholder={policyDetailsPlaceholder}
              />
            )
          }}
        </Field>
      </>
      }
    </Flex>
  )
})
