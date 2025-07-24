import { Field } from 'react-final-form'
import { fields } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Switch, Text } from 'theme-ui'

type PublicContactSectionProps = {
  isContactable: boolean
}

export const PublicContactSection = ({
  isContactable,
}: PublicContactSectionProps) => {
  const { description, placeholder, title } = fields.publicContentPreference
  const name = 'isContactable'

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
              checked={isContactable}
              data-cy={`${name}-${isContactable}`}
              data-testid={name}
              label={placeholder}
              onChange={() => input.onChange(!isContactable)}
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
}
