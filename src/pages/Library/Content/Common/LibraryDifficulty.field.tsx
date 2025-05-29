import { Field } from 'react-final-form'
import { SelectField } from 'src/common/Form/Select.field'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'
import { draftValidationWrapper, required } from 'src/utils/validators'

import { intro } from '../../labels'
import { DIFFICULTY_OPTIONS } from './FormSettings'

export const LibraryDifficultyField = () => {
  const { placeholder, title } = intro.difficultyLevel
  const name = 'difficultyLevel'

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        px={1}
        id={name}
        name={name}
        data-cy="difficulty-select"
        validate={(values, allValues) =>
          draftValidationWrapper(values, allValues, required)
        }
        validateFields={[]}
        isEqual={COMPARISONS.textInput}
        component={SelectField}
        options={DIFFICULTY_OPTIONS}
        placeholder={placeholder}
      />
    </FormFieldWrapper>
  )
}
