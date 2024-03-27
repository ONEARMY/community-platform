import { Field } from 'react-final-form'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import { FormFieldWrapper } from 'src/pages/Howto/Content/Common'
import { fields } from 'src/pages/Question/labels'

export const QuestionCategoryField = () => {
  const { placeholder, title } = fields.category
  const name = 'questionCategory'

  return (
    <FormFieldWrapper htmlFor={name} text={title}>
      <Field
        name={name}
        id={name}
        render={({ input, ...rest }) => (
          <CategoriesSelect
            {...rest}
            isForm={true}
            onChange={input.onChange}
            value={input.value}
            placeholder={placeholder}
            type="question"
          />
        )}
      />
    </FormFieldWrapper>
  )
}
