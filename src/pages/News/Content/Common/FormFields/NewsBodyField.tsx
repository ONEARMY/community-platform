import { Field } from 'react-final-form'
import { FieldMarkdown } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { fields } from 'src/pages/News/labels'

interface IProps {
  diffMarkdown?: string
}

export const NewsBodyField = ({ diffMarkdown }: IProps) => {
  const name = 'body'

  return (
    <FormFieldWrapper htmlFor={name} text={fields.body.title} required>
      <Field
        data-cy={`field-${name}`}
        component={FieldMarkdown}
        diffMarkdown={diffMarkdown}
        id={name}
        name={name}
        placeholder={fields.body.placeholder}
      />
    </FormFieldWrapper>
  )
}
