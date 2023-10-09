import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { Box, Label } from 'theme-ui'

import { contact } from 'src/pages/User/labels'

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
        validateFields={[]}
      />
    </Box>
  )
}
