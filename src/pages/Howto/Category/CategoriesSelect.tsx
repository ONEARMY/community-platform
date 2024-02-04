import { useMemo } from 'react'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import { useCommonStores } from 'src/index'

import { FieldContainer } from '../../../common/Form/FieldContainer'

/**
 * @deprecated in favor of CategoriesSelectV2
 */
export const CategoriesSelect = observer(
  ({ value, onChange, placeholder, isForm, type }) => {
    const {
      categoriesStore,
      researchCategoriesStore,
      questionCategoriesStore,
    } = useCommonStores().stores

    const categories = useMemo(() => {
      if (type === 'howto') {
        return categoriesStore.allCategories
      } else if (type === 'research') {
        return researchCategoriesStore.allResearchCategories
      } else if (type === 'question') {
        return questionCategoriesStore.allQuestionCategories
      }
      return []
    }, [type])

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
