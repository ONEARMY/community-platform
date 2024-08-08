import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { fields } from 'src/pages/UserSettings/labels'
import { isContactable } from 'src/utils/helpers'
import { Flex, Heading, Switch, Text } from 'theme-ui'

import type { IUser } from 'src/models'

interface Props {
  isContactableByPublic: IUser['isContactableByPublic']
}

export const PublicContactSection = observer((props: Props) => {
  const { isContactableByPublic } = props
  const { description, placeholder, title } = fields.publicContentPreference
  const isChecked = isContactable(isContactableByPublic)
  const name = 'isContactableByPublic'

  return (
    <Flex
      data-testid="PublicContactSection"
      sx={{
        flexDirection: 'column',
        gap: 2,
        backgroundColor: 'background',
        padding: 4,
        borderRadius: 4,
      }}
    >
      <Heading as="h2">{title}</Heading>
      <Text variant="quiet" sx={{ fontSize: 2 }}>
        {description}
      </Text>
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
    </Flex>
  )
})
