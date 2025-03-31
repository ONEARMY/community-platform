import { useEffect, useState } from 'react'
import { Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { profilesService } from 'src/pages/Research/profiles.service'
import { useDebouncedCallback } from 'use-debounce'

import type { IOption } from './LoadUserNameOptions'

interface IProps {
  input: {
    value: string[]
    onChange: (v: string[]) => void
  }
  placeholder?: string
  isForm?: boolean
}

export const UserNameSelect = (props: IProps) => {
  const { input, isForm, placeholder } = props
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<IOption[]>([])

  const loadOptions = async (inputVal: string) => {
    if (!inputVal) {
      setOptions([])
      return
    }

    const profiles = await profilesService.search(inputVal)
    const options = profiles.map((x) => ({
      label: x.displayName,
      value: x.username,
    }))

    setOptions(options)
  }

  const debounceLoad = useDebouncedCallback((q: string) => loadOptions(q), 500)

  useEffect(() => {
    debounceLoad(inputValue)
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
}
