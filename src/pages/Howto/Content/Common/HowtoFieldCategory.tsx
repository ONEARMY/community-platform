import { Field } from 'react-final-form'

import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import {
  FormFieldWrapper,
  HowtoCategoryGuidance,
} from 'src/pages/Howto/Content/Common'
import { intro } from 'src/pages/Howto/labels'

import type { ICategory } from 'src/models/categories.model'

interface IProps {
  category: ICategory | undefined
}

export const HowtoFieldCategory = ({ category }: IProps) => {
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
      <HowtoCategoryGuidance category={category} type="main" />
    </FormFieldWrapper>
  )
}
