import { Field } from 'react-final-form'
import { FieldTextarea } from '@onearmy.apps/components'

import { FormFieldWrapper } from '../../../../../pages/Howto/Content/Common'
import { QUESTION_MAX_DESCRIPTION_LENGTH } from '../../../../../pages/Question/constants'
import { fields } from '../../../../../pages/Question/labels'
import { composeValidators, required } from '../../../../../utils/validators'

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
