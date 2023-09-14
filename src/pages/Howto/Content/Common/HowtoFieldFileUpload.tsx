import { Field } from 'react-final-form'
import { Text } from 'theme-ui'

import { FileInputField } from 'src/common/Form/FileInput.field'
import { intro } from '../../labels'
import { FormFieldWrapper } from '.'

export const HowtoFieldFileUpload = () => {
  const { description, title } = intro.files
  const name = 'files'

  return (
    <FormFieldWrapper htmlFor={name} text={title}>
      <Field id={name} name={name} data-cy={name} component={FileInputField} />
      <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
        {description}
      </Text>
    </FormFieldWrapper>
  )
}
