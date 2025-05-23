import * as React from 'react'
import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { FieldTextarea, Select, visitorDisplayData } from 'oa-components'
import { userVisitorPreferencePolicies } from 'oa-shared'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { Flex, Heading, Switch, Text } from 'theme-ui'

import { fields, headings } from '../../labels'

import type { IUser, UserVisitorPreferencePolicy } from 'oa-shared'

interface Props {
  openToVisitors: IUser['openToVisitors']
}

const visitorPolicyOptions = userVisitorPreferencePolicies.map((policy) => ({
  value: policy,
  label: visitorDisplayData.get(policy)?.label || policy,
}))

function findPolicy(policyValue: UserVisitorPreferencePolicy) {
  return visitorPolicyOptions.find(({ value }) => value === policyValue)
}

const { title: preferenceTitle, description: preferenceDescription } =
  fields.visitorPreference
const { title: policyTitle } = fields.visitorPolicy
const { title: policyDetailsTitle, placeholder: policyDetailsPlaceholder } =
  fields.visitorDetails
const { visitors } = headings

export const VisitorSection = observer((props: Props) => {
  const { openToVisitors } = props

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
      <Field name="openToVisitors">
        {({ input }) => {
          return (
            <Switch
              checked={!!openToVisitors}
              data-testid="openToVisitors-switch"
              label={preferenceTitle}
              onChange={() =>
                input.onChange(openToVisitors || { policy: 'open' })
              }
              sx={{
                'input:checked ~ &': {
                  backgroundColor: 'green',
                },
              }}
            />
          )
        }}
      </Field>
      {openToVisitors && (
        <>
          <Text>{policyTitle} *</Text>
          <FieldContainer data-cy="openToVisitors-policy">
            <Field name="openToVisitors.policy">
              {({ input }) => {
                return (
                  <Select
                    options={visitorPolicyOptions}
                    defaultValue={findPolicy(openToVisitors.policy || 'open')}
                    onChange={({ value }) => input.onChange(value)}
                  />
                )
              }}
            </Field>
          </FieldContainer>
          <Text>{policyDetailsTitle}</Text>
          <Field
            name="openToVisitors.details"
            data-cy="openToVisitors-details"
            component={FieldTextarea}
            placeholder={policyDetailsPlaceholder}
            value={openToVisitors.details}
          />
        </>
      )}
    </Flex>
  )
})
