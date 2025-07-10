import { Field } from 'react-final-form'
import { FieldTextarea } from 'oa-components'
import {
  MESSAGE_MAX_CHARACTERS,
  MESSAGE_MIN_CHARACTERS,
} from 'src/pages/User/constants'
import { contact } from 'src/pages/User/labels'
import { required } from 'src/utils/validators'
import { Box, Label } from 'theme-ui'

export const UserContactFieldMessage = () => {
  const { title, placeholder } = contact.message
  const name = 'message'

  const sx = {
    backgroundColor: 'white',
    height: '300px',
    resize: 'vertical',
  }

  return (
    <Box>
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
        sx={sx}
        validate={required}
        validateFields={[]}
        showCharacterCount
      />
    </Box>
  )
}
