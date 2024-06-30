import { Field } from 'react-final-form'
import { FieldTextarea } from '@onearmy.apps/components'
import { Box, Label } from 'theme-ui'

import {
  MESSAGE_MAX_CHARACTERS,
  MESSAGE_MIN_CHARACTERS,
} from '../../../pages/User/constants'
import { contact } from '../../../pages/User/labels'
import { required } from '../../../utils/validators'

export const UserContactFieldMessage = () => {
  const { title, placeholder } = contact.message
  const name = 'message'

  const sx = {
    backgroundColor: 'white',
    height: '300px',
    resize: 'vertical',
  }

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
        sx={sx}
        validate={required}
        validateFields={[]}
        showCharacterCount
      />
    </Box>
  )
}
