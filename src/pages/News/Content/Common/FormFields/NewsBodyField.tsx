import { Field } from 'react-final-form'
import { FieldTextarea } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { fields } from 'src/pages/News/labels'
import { composeValidators, required } from 'src/utils/validators'

export const NewsBodyField = () => {
  const name = 'body'

  return (
    <FormFieldWrapper htmlFor={name} text={fields.body.title} required>
      <Field
        data-cy={`field-${name}`}
        component={FieldTextarea}
        id={name}
        name={name}
        placeholder={fields.body.placeholder}
        validate={composeValidators(required)}
        showCharacterCount
      />
    </FormFieldWrapper>
  )
}
