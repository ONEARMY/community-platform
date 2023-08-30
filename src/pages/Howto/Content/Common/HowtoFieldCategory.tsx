import { Field } from 'react-final-form'

import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import { intro } from '../../labels'
import { FormFieldWrapper } from '.'

export const HowtoFieldCategory = () => {
  const { placeholder, title } = intro.category

  return (
    <FormFieldWrapper text={title} required>
      <Field
        name="category"
        render={({ input, ...rest }) => (
          <CategoriesSelect
            {...rest}
            isForm={true}
            onChange={(category) => input.onChange(category)}
            value={input.value}
            placeholder={placeholder}
            type="howto"
          />
        )}
      />
    </FormFieldWrapper>
  )
}
