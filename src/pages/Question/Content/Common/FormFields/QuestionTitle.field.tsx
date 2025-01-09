import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFieldWrapper'
import {
  QUESTION_MAX_TITLE_LENGTH,
  QUESTION_MIN_TITLE_LENGTH,
} from 'src/pages/Question/constants'
import { fields } from 'src/pages/Question/labels'
import {
  composeValidators,
  endsWithQuestionMark,
  minValue,
  required,
} from 'src/utils/validators'

export const QuestionTitleField = () => {
  const { placeholder, title } = fields.title
  const name = 'title'

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        data-cy={`field-${name}`}
        name={name}
        id={name}
        validate={composeValidators(
          required,
          minValue(QUESTION_MIN_TITLE_LENGTH),
          endsWithQuestionMark(),
        )}
        component={FieldInput}
        placeholder={placeholder}
        minLength={QUESTION_MIN_TITLE_LENGTH}
        maxLength={QUESTION_MAX_TITLE_LENGTH}
        showCharacterCount
        onBlur
      />
    </FormFieldWrapper>
  )
}
