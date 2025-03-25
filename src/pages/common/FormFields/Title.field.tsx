import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import {
  NEWS_MAX_TITLE_LENGTH,
  NEWS_MIN_TITLE_LENGTH,
} from 'src/pages/News/constants'
import { fields } from 'src/pages/News/labels'

interface IProps {
  validate: (value: any) => Promise<any>
}

export const TitleField = ({ validate }: IProps) => {
  const { placeholder, title } = fields.title
  const name = 'title'

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        data-cy={`field-${name}`}
        name={name}
        id={name}
        validate={validate}
        component={FieldInput}
        placeholder={placeholder}
        minLength={NEWS_MIN_TITLE_LENGTH}
        maxLength={NEWS_MAX_TITLE_LENGTH}
        showCharacterCount
        onBlur
      />
    </FormFieldWrapper>
  )
}
