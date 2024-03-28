import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { questionService } from 'src/pages/Question/question.service'

import { FieldContainer } from '../../../common/Form/FieldContainer'

import type { ICategory } from 'src/models/categories.model'

/**
 * @deprecated in favor of CategoriesSelectV2
 */
export const CategoriesSelect = observer(
  ({ value, onChange, placeholder, isForm, type }) => {
    const [categories, setCategories] = useState<ICategory[]>([])

    const { categoriesStore, researchCategoriesStore } =
      useCommonStores().stores

    useEffect(() => {
      const initCategories = async () => {
        if (type === 'howto') {
          const categories = categoriesStore.allCategories
          setCategories(categories)
        } else if (type === 'question') {
          const categories = await questionService.getQuestionCategories()
          setCategories(categories)
        } else if (type === 'research') {
          const categories = researchCategoriesStore.allResearchCategories
          setCategories(categories)
        }
      }

      initCategories()
    }, [])

    const selectOptions = categories
      .map((category) => ({
        value: { ...category },
        label: category.label,
      }))
      .filter((option) => option?.value?.label !== value?.label)

    const handleChange = (changedValue) => {
      onChange(changedValue?.value ?? null)
    }

    return (
      <FieldContainer
        data-cy={categories ? 'category-select' : 'category-select-empty'}
      >
        <Select
          variant={isForm ? 'form' : undefined}
          options={selectOptions}
          placeholder={placeholder}
          value={value ? value : null}
          onChange={handleChange}
          isClearable={true}
        />
      </FieldContainer>
    )
  },
)
