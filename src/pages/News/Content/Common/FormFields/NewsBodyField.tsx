import { Field } from 'react-final-form'
import { FieldMarkdown } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { fields } from 'src/pages/News/labels'

interface IProps {
  imageUpload: (image: File) => Promise<string>
  diffMarkdown?: string
}

export const NewsBodyField = ({ diffMarkdown, imageUpload }: IProps) => {
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
        imageUploadHandler={imageUpload}
      />
    </FormFieldWrapper>
  )
}
