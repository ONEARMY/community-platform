import { Field } from 'react-final-form'
import { Box, Label } from 'theme-ui'
import { FieldTextarea } from 'oa-components'

import { contact } from 'src/pages/User/labels'
import {
  MESSAGE_MAX_CHARACTERS,
  MESSAGE_MIN_CHARACTERS,
} from 'src/pages/User/constants'
import { required } from 'src/utils/validators'

export const UserContactFieldMessage = () => {
  const { title, placeholder } = contact.message
  const name = 'message'

  return (
    <Box mb={3}>
      <Label htmlFor={name}>{`${title} *`}</Label>
      <Field
        name={name}
        placeholder={placeholder}
        minLength={MESSAGE_MIN_CHARACTERS}
        maxLength={MESSAGE_MAX_CHARACTERS}
        data-cy={name}
        data-testid={name}
        modifiers={{ capitalize: true, trim: true }}
        component={FieldTextarea}
        style={{ resize: 'vertical', height: '300px' }}
        validate={required}
        validateFields={[]}
        showCharacterCount
      />
    </Box>
  )
}
