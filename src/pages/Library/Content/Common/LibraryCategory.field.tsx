import { useEffect, useState } from 'react'
import { Field } from 'react-final-form'
import { CategoriesSelectV2 } from 'src/pages/common/Category/CategoriesSelectV2'
import { FormFieldWrapper } from 'src/pages/common/FormFieldWrapper'
import { LibraryCategoryGuidance } from 'src/pages/Library/Content/Common'
import { intro } from 'src/pages/Library/labels'

import { libraryService } from '../../library.service'

import type { SelectValue } from 'src/pages/common/Category/CategoriesSelectV2'

export const LibraryCategoryField = () => {
  const { placeholder, title } = intro.category
  const [options, setOptions] = useState<SelectValue[]>([])

  useEffect(() => {
    const getCategories = async () => {
      const categories = await libraryService.getHowtoCategories()
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
            <LibraryCategoryGuidance category={input.value} type="main" />
          </>
        )}
      />
    </FormFieldWrapper>
  )
}
