import { Field } from 'react-final-form'
import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FileInputField } from 'src/common/Form/FileInput.field'
import { FormFieldWrapper } from 'src/pages/Library/Content/Common/FormFieldWrapper'
import { Text } from 'theme-ui'

import { intro } from '../../labels'

export const HowtoFieldFileUpload = () => {
  const { description, title } = intro.files
  const name = 'files'

  return (
    <AuthWrapper
      roleRequired={UserRole.ADMIN}
      fallback={
        <FormFieldWrapper htmlFor={name} text={title}>
          <Field
            id={name}
            name={name}
            data-cy={name}
            component={FileInputField}
          />
          <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
            {description}
          </Text>
        </FormFieldWrapper>
      }
    >
      <FormFieldWrapper htmlFor={name} text={title}>
        <Field
          id={name}
          name={name}
          data-cy={name}
          admin={true}
          component={FileInputField}
        />
        <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
          {'Maximum file size 300MB'}
        </Text>
      </FormFieldWrapper>
    </AuthWrapper>
  )
}
