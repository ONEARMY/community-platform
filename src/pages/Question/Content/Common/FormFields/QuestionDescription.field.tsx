import { Field } from 'react-final-form'
import { FieldTextarea } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFieldWrapper'
import { QUESTION_MAX_DESCRIPTION_LENGTH } from 'src/pages/Question/constants'
import { fields } from 'src/pages/Question/labels'
import { composeValidators, required } from 'src/utils/validators'

export const QuestionDescriptionField = () => {
  const { placeholder, title } = fields.description
  const name = 'description'

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        data-cy={`field-${name}`}
        component={FieldTextarea}
        id={name}
        name={name}
        maxLength={QUESTION_MAX_DESCRIPTION_LENGTH}
        placeholder={placeholder}
        validate={composeValidators(required)}
        showCharacterCount
      />
    </FormFieldWrapper>
  )
}
