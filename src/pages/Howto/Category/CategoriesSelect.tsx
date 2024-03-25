import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { FieldContainer } from '../../../common/Form/FieldContainer'

import type { ICategory } from 'src/models/categories.model'

/**
 * @deprecated in favor of CategoriesSelectV2
 */
export const CategoriesSelect = observer(
  ({ value, onChange, placeholder, isForm, type }) => {
    const { categoriesStore, researchCategoriesStore } =
      useCommonStores().stores

    let categories: ICategory[] = []
    if (type === 'howto') {
      categories = categoriesStore.allCategories
    } else if (type === 'research') {
      categories = researchCategoriesStore.allResearchCategories
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
