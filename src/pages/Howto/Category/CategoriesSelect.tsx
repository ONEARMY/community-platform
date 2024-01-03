import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import { useCommonStores } from 'src/index'

import { FieldContainer } from '../../../common/Form/FieldContainer'

import type { ICategory } from 'src/models/categories.model'

export const CategoriesSelect = observer(
  ({ value, onChange, placeholder, isForm, type }) => {
    let categories: ICategory[] = []
    if (type === 'howto') {
      const { categoriesStore } = useCommonStores().stores
      categories = categoriesStore.allCategories
    } else if (type === 'research') {
      const { researchCategoriesStore } = useCommonStores().stores
      categories = researchCategoriesStore.allResearchCategories
    } else if (type === 'question') {
      const { questionCategoriesStore } = useCommonStores().stores
      categories = questionCategoriesStore.allQuestionCategories
    }

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
