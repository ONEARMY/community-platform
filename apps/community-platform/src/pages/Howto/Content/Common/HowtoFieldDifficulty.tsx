import { Field } from 'react-final-form'

import { SelectField } from '../../../../common/Form/Select.field'
import { FormFieldWrapper } from '../../../../pages/Howto/Content/Common/FormFieldWrapper'
import { COMPARISONS } from '../../../../utils/comparisons'
import { draftValidationWrapper, required } from '../../../../utils/validators'
import { intro } from '../../labels'
import { DIFFICULTY_OPTIONS } from './FormSettings'

export const HowtoFieldDifficulty = () => {
  const { placeholder, title } = intro.difficulty_level
  const name = 'difficulty_level'

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
