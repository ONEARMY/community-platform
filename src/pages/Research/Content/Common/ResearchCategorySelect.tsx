import { useEffect, useState } from 'react'
import { Field } from 'react-final-form'
import { CategoriesSelectV2 } from 'src/pages/common/Category/CategoriesSelectV2'

import { overview } from '../../labels'
import { researchService } from '../../research.service'

import type { SelectValue } from 'src/pages/common/Category/CategoriesSelectV2'

const ResearchFieldCategory = () => {
  const [options, setOptions] = useState<SelectValue[]>([])

  useEffect(() => {
    const getCategories = async () => {
      const categories = await researchService.getResearchCategories()
      setOptions(
        categories
          .filter((x) => !x._deleted)
          .map((x) => ({ label: x.label, value: x })),
      )
    }

    getCategories()
  }, [])

  return (
    <Field
      name="researchCategory"
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
