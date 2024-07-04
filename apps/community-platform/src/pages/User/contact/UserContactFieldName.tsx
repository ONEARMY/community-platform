import { Field } from 'react-final-form'
import { FieldInput } from '@onearmy.apps/components'
import { Box, Label } from 'theme-ui'

import { contact } from '../../../pages/User/labels'

export const UserContactFieldName = () => {
  const { title, placeholder } = contact.name
  const name = 'name'

  return (
    <Box mb={3}>
      <Label htmlFor={name}>{title}</Label>
      <Field
        component={FieldInput}
        data-cy={name}
        data-testid={name}
        name={name}
        placeholder={placeholder}
        sx={{ backgroundColor: 'white' }}
        validateFields={[]}
      />
    </Box>
  )
}
