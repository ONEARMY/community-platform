import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { contact } from 'src/pages/User/labels'
import {
  composeValidators,
  required,
  validateEmail,
} from 'src/utils/validators'
import { Box, Label } from 'theme-ui'

interface Props {
  email: string | null
}

export const UserContactFieldEmail = ({ email }: Props) => {
  if (!email) return null

  const { title, placeholder } = contact.email
  const name = 'email'

  return (
    <Box mb={3}>
      <Label htmlFor={name}>{`${title} *`}</Label>
      <Field
        component={FieldInput}
        data-cy={name}
        data-testid={name}
        disabled
        initialValue={email}
        name={name}
        placeholder={placeholder}
        sx={{ backgroundColor: 'white' }}
        validate={composeValidators(validateEmail, required)}
        validateFields={[]}
      />
    </Box>
  )
}
