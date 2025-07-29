import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { fields } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Switch, Text } from 'theme-ui'

import type { IUser } from 'oa-shared'

interface Props {
  isContactableByPublic: IUser['isContactableByPublic']
}

export const PublicContactSection = observer((props: Props) => {
  const { isContactableByPublic } = props
  const { description, placeholder, title } = fields.publicContentPreference
  const name = 'isContactableByPublic'

  return (
    <Flex
      data-testid="PublicContactSection"
      data-cy="PublicContactSection"
      sx={{
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <a id="public-contact"></a>
      <Heading as="h2">{title}</Heading>
      <Text variant="quiet" sx={{ fontSize: 2 }}>
        {description}
      </Text>
      <Field name={name}>
        {({ input }) => {
          return (
            <Switch
              checked={isContactableByPublic}
              data-cy={`${name}-${isContactableByPublic}`}
              data-testid={name}
              label={placeholder}
              onChange={() => input.onChange(!isContactableByPublic)}
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
