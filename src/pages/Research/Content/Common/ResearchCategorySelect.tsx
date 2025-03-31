import { useEffect, useState } from 'react'
import { Field } from 'react-final-form'
import { CategoriesSelectV2 } from 'src/pages/common/Category/CategoriesSelectV2'
import { categoryService } from 'src/services/categoryService'

import { overview } from '../../labels'

import type { SelectValue } from 'src/pages/common/Category/CategoriesSelectV2'

const ResearchFieldCategory = () => {
  const [options, setOptions] = useState<SelectValue[]>([])

  useEffect(() => {
    const getCategories = async () => {
      const categories = await categoryService.getCategories('research')
      setOptions(
        categories.map(({ id, name }) => ({
          value: id.toString(),
          label: name,
        })),
      )
    }

    getCategories()
  }, [])

  return (
    <Field
      name="category"
      render={({ input }) => (
        <CategoriesSelectV2
          isForm={true}
          onChange={(category) => input.onChange(category)}
          value={input.value}
          placeholder={overview.categories.placeholder || ''}
          categories={options}
        />
      )}
    />
  )
}

export default ResearchFieldCategory
