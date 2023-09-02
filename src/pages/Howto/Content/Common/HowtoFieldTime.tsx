import { Field } from 'react-final-form'

import { SelectField } from 'src/common/Form/Select.field'
import { COMPARISONS } from 'src/utils/comparisons'
import { draftValidationWrapper, required } from 'src/utils/validators'
import { intro } from '../../labels'
import { TIME_OPTIONS } from './FormSettings'
import { FormFieldWrapper } from '.'

export const HowtoFieldTime = () => {
  const { placeholder, title } = intro.time
  const name = 'time'

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        id={name}
        name={name}
        validate={(values, allValues) =>
          draftValidationWrapper(values, allValues, required)
        }
        validateFields={[]}
        isEqual={COMPARISONS.textInput}
        options={TIME_OPTIONS}
        component={SelectField}
        data-cy="time-select"
        placeholder={placeholder}
      />
    </FormFieldWrapper>
  )
}
