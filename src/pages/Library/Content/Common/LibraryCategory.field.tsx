import { useEffect, useMemo, useState } from 'react'
import { Field } from 'react-final-form'
import { CategoriesSelectV2 } from 'src/pages/common/Category/CategoriesSelectV2'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { intro } from 'src/pages/Library/labels'
import { categoryService } from 'src/services/categoryService'
import { required } from 'src/utils/validators'

import { LibraryCategoryGuidance } from './LibraryCategoryGuidance'

import type { Category, SelectValue } from 'oa-shared'

export const LibraryCategoryField = () => {
  const { placeholder, title } = intro.category

  const [categories, setCategories] = useState<Category[]>([])
  const options = useMemo<SelectValue[]>(
    () => categories.map((x) => ({ label: x.name, value: x.id.toString() })),
    [categories],
  )

  useEffect(() => {
    const getCategories = async () => {
      const categories = await categoryService.getCategories('projects')

      if (categories) {
        setCategories(categories)
      }
    }

    getCategories()
  }, [])

  return (
    <FormFieldWrapper text={title} required>
      <Field
        name="category"
        validate={required}
        validateFields={[]}
        render={({ input }) => (
          <>
            <CategoriesSelectV2
              isForm={true}
              onChange={(category) => input.onChange(category)}
              value={input.value}
              placeholder={placeholder || ''}
              categories={options}
            />
            {input?.value?.value && (
              <LibraryCategoryGuidance
                category={categories.find(
                  (x) => x.id === Number(input.value.value),
                )}
                type="main"
              />
            )}
          </>
        )}
      />
    </FormFieldWrapper>
  )
}
