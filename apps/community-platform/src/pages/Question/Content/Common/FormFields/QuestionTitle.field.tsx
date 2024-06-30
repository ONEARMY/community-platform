import { Field } from 'react-final-form'
import { FieldInput } from '@onearmy.apps/components'

import { useCommonStores } from '../../../../../common/hooks/useCommonStores'
import { FormFieldWrapper } from '../../../../../pages/Howto/Content/Common'
import {
  QUESTION_MAX_TITLE_LENGTH,
  QUESTION_MIN_TITLE_LENGTH,
} from '../../../../../pages/Question/constants'
import { fields } from '../../../../../pages/Question/labels'
import {
  composeValidators,
  minValue,
  required,
  validateTitle,
} from '../../../../../utils/validators'

import type { MainFormAction } from '../../../../../common/Form/types'

interface IProps {
  parentType: MainFormAction
  formValues: any
}

export const QuestionTitleField = (props: IProps) => {
  const { parentType, formValues } = props
  const { questionStore } = useCommonStores().stores

  const { placeholder, title } = fields.title
  const name = 'title'
  const questionId = (!!formValues && formValues._id) ?? formValues._id

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        data-cy={`field-${name}`}
        name={name}
        id={name}
        validate={composeValidators(
          required,
          minValue(QUESTION_MIN_TITLE_LENGTH),
          validateTitle(parentType, questionId, questionStore),
        )}
        component={FieldInput}
        placeholder={placeholder}
        minLength={QUESTION_MIN_TITLE_LENGTH}
        maxLength={QUESTION_MAX_TITLE_LENGTH}
        showCharacterCount
      />
    </FormFieldWrapper>
  )
}
