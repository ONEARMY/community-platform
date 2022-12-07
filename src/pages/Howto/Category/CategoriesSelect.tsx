import { observer } from 'mobx-react'
import { FieldContainer } from '../../../common/Form/FieldContainer'
import { Select } from 'oa-components'
import { useCommonStores } from 'src'

export const CategoriesSelect = observer(
  ({ value, onChange, placeholder, isForm }) => {
    const { categoriesStore } = useCommonStores().stores
    const allCategories = categoriesStore.allCategories
    const selectOptions = allCategories.map((category) => ({
      value: { ...category },
      label: category.label,
    }))
    const handleChange = (changedValue) => {
      onChange(changedValue?.value ?? null)
    }

    return (
      <FieldContainer
        data-cy={allCategories ? 'category-select' : 'category-select-empty'}
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
