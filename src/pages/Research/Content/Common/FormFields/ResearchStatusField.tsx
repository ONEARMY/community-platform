import { Field } from 'react-final-form'
import { researchStatusOptions } from 'oa-shared'
import { SelectField } from 'src/common/Form/Select.field'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { overview } from 'src/pages/Research/labels'

export const ResearchStatusField = () => {
  const name = 'status'
  const { placeholder, title } = overview.status

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        name={name}
        data-cy={name}
        component={SelectField}
        placeholder={placeholder}
        options={researchStatusOptions}
      />
    </FormFieldWrapper>
  )
}
