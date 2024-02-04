import { Select } from 'oa-components'

import { FieldContainer } from '../../../common/Form/FieldContainer'

export type SelectValue = { label: string; value: string }

export type CategoriesSelectProps = {
  value: SelectValue | null
  placeholder: string
  isForm: boolean
  options: SelectValue[]
  onChange: (value: string) => void
}

export const CategoriesSelectV2 = ({
  value,
  placeholder,
  isForm,
  options: categories,
  onChange,
}: CategoriesSelectProps) => {
  const handleChange = (changedValue) => {
    onChange(changedValue?.value ?? null)
  }

  return (
    <FieldContainer
      data-cy={categories ? 'category-select' : 'category-select-empty'}
    >
      <Select
        variant={isForm ? 'form' : undefined}
        options={categories}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        isClearable={true}
      />
    </FieldContainer>
  )
}
