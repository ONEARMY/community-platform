import * as React from 'react'
import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { Box, Heading, Switch, Text } from 'theme-ui'

import { fields } from '../../../../pages/UserSettings/labels'
import { isContactable } from '../../../../utils/helpers'
import { FlexSectionContainer } from './elements'

import type { IUser } from '../../../../models'

interface Props {
  isContactableByPublic: IUser['isContactableByPublic']
}

export const PublicContactSection = observer((props: Props) => {
  const { isContactableByPublic } = props
  const { description, placeholder, title } = fields.publicContentPreference
  const isChecked = isContactable(isContactableByPublic)
  const name = 'isContactableByPublic'

  return (
    <FlexSectionContainer>
      <Heading as="h2" variant="small">
        {title}
      </Heading>
      <Text mt={4} mb={4}>
        {description}
      </Text>
      <Box mt={2}>
        <Field name={name}>
          {({ input }) => {
            return (
              <Switch
                checked={isChecked}
                data-cy={name}
                data-testid={name}
                label={placeholder}
                onChange={() => input.onChange(!isChecked)}
                sx={{
                  'input:checked ~ &': {
                    backgroundColor: 'green',
                  },
                }}
              />
            )
          }}
        </Field>
      </Box>
    </FlexSectionContainer>
  )
})
