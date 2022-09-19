import { useState } from 'react'
import { observer } from 'mobx-react'
import { FieldContainer } from '../../../components/Form/FieldContainer'
import { Select } from 'oa-components'
import { useCommonStores } from 'src'

export const CategoriesSelect = observer(({ value, onChange, placeholder }) => {
  const { categoriesStore } = useCommonStores().stores
  const [selectedCategory, setSelectedCategory] = useState(value)
  const allCategories = categoriesStore.allCategories
  const selectOptions = allCategories.map((category) => ({
    value: { ...category },
    label: category.label,
  }))
  const handleChange = (value) => {
    if (value) {
      setSelectedCategory(value)
      onChange(value.value)
    } else {
      setSelectedCategory(null)
      onChange(null)
    }
  }

  return (
    <FieldContainer
      data-cy={allCategories ? 'category-select' : 'category-select-empty'}
    >
      <Select
        options={selectOptions}
        placeholder={placeholder}
        value={selectedCategory ? selectedCategory : null}
        onChange={handleChange}
        isClearable={true}
      />
    </FieldContainer>
  )
})
