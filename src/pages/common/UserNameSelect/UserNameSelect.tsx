import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { loadUserNameOptions } from './LoadUserNameOptions'

import type { IOption } from './LoadUserNameOptions'

interface IProps {
  input: {
    value: string[]
    onChange: (v: string[]) => void
  }
  defaultOptions?: string[]
  placeholder?: string
  isForm?: boolean
}

export const UserNameSelect = observer((props: IProps) => {
  const { defaultOptions, input, isForm, placeholder } = props
  const { userStore } = useCommonStores().stores
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<IOption[]>([])

  const loadOptions = async (inputVal: string) => {
    const selectOptions = await loadUserNameOptions(
      userStore,
      defaultOptions,
      inputVal,
    )
    setOptions(selectOptions)
  }

  // Effect to load options whenever the input value changes
  useEffect(() => {
    loadOptions(inputValue)
  }, [inputValue])

  const value = input.value?.length
    ? input.value.map((user) => ({
        value: user,
        label: user,
      }))
    : []

  return (
    <FieldContainer data-cy="UserNameSelect">
      <Select
        variant={isForm ? 'form' : undefined}
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={(v: IOption[]) => input.onChange(v.map((user) => user.value))}
        onInputChange={setInputValue}
        isClearable={true}
        isMulti={true}
      />
    </FieldContainer>
  )
})
