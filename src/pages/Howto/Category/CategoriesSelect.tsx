import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { FieldContainer } from '../../../components/Form/FieldContainer'
import { DropdownIndicator } from '../../../components/DropdownIndicator'
import Select from 'react-select'
import { SelectStyles, FilterStyles } from '../../../components/Form/Select.field'
import { useCommonStores } from 'src'

export const CategoriesSelect = observer(
  ({ value, onChange, styleVariant, placeholder, ...rest }) => {
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
          {...rest}
          components={{ DropdownIndicator }}
          styles={styleVariant === 'selector' ? SelectStyles : FilterStyles}
          options={selectOptions}
          placeholder={placeholder}
          value={selectedCategory ? selectedCategory : null}
          onChange={handleChange}
          classNamePrefix={'data-cy'}
          isClearable
        />
      </FieldContainer>
    )
  },
)
