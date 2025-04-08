import { Field } from 'react-final-form'
import { FieldTextarea } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { fields } from 'src/pages/News/labels'

interface IProps {
  diffMarkdown?: string
}

export const NewsSummaryField = ({ diffMarkdown }: IProps) => {
  const name = 'summary'

  return (
    <FormFieldWrapper
      description={fields.summary.description}
      htmlFor={name}
      text={fields.summary.title}
    >
      <Field
        data-cy={`field-${name}`}
        component={FieldTextarea}
        diffMarkdown={diffMarkdown}
        id={name}
        maxLength={180}
        name={name}
        placeholder={fields.summary.placeholder}
        showCharacterCount
      />
    </FormFieldWrapper>
  )
}
