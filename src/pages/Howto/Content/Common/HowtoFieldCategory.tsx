import { useEffect, useState } from 'react'
import { Field } from 'react-final-form'
import { CategoriesSelectV2 } from 'src/pages/common/Category/CategoriesSelectV2'
import {
  FormFieldWrapper,
  HowtoCategoryGuidance,
} from 'src/pages/Howto/Content/Common'
import { intro } from 'src/pages/Howto/labels'

import { howtoService } from '../../howto.service'

import type { SelectValue } from 'src/pages/common/Category/CategoriesSelectV2'

export const HowtoFieldCategory = () => {
  const { placeholder, title } = intro.category
  const [options, setOptions] = useState<SelectValue[]>([])

  useEffect(() => {
    const getCategories = async () => {
      const categories = await howtoService.getHowtoCategories()
      setOptions(
        categories
          .filter((x) => !x._deleted)
          .map((x) => ({ label: x.label, value: x })),
      )
    }

    getCategories()
  }, [])

  return (
    <FormFieldWrapper text={title} required>
      <Field
        name="category"
        render={({ input }) => (
          <>
            <CategoriesSelectV2
              isForm={true}
              onChange={(category) => input.onChange(category)}
              value={input.value}
              placeholder={placeholder || ''}
              categories={options}
            />
            <HowtoCategoryGuidance category={input.value} type="main" />
          </>
        )}
      />
    </FormFieldWrapper>
  )
}
