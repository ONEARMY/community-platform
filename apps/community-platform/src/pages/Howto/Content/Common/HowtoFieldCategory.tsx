import { Field } from 'react-final-form'

import { CategoriesSelect } from '../../../../pages/Howto/Category/CategoriesSelect'
import {
  FormFieldWrapper,
  HowtoCategoryGuidance,
} from '../../../../pages/Howto/Content/Common'
import { intro } from '../../../../pages/Howto/labels'

import type { ICategory } from '../../../../models/categories.model'

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
