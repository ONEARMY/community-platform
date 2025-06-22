import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'
import { composeValidators, minValue, required } from 'src/utils/validators'

import {
  LIBRARY_TITLE_MAX_LENGTH,
  LIBRARY_TITLE_MIN_LENGTH,
} from '../../constants'
import { intro } from '../../labels'

export const LibraryTitleField = () => {
  const { placeholder, title } = intro.title

  const name = 'title'

  const titleValidation = (value: string) => {
    const validators = composeValidators(
      required,
      minValue(LIBRARY_TITLE_MIN_LENGTH),
    )

    return validators(value)
  }

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        id={name}
        name={name}
        data-cy="intro-title"
        validateFields={[]}
        validate={(value) => titleValidation(value)}
        isEqual={COMPARISONS.textInput}
        modifiers={{ capitalize: true, trim: true }}
        component={FieldInput}
        minLength={LIBRARY_TITLE_MIN_LENGTH}
        maxLength={LIBRARY_TITLE_MAX_LENGTH}
        placeholder={placeholder}
        showCharacterCount={true}
      />
    </FormFieldWrapper>
  )
}
