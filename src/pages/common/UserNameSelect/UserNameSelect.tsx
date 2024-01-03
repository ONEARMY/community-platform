import { useState, useEffect } from 'react'
import { useCommonStores } from 'src/index'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import type { IUserPP } from 'src/models'

const USER_RESULTS_LIMIT = 20

interface IProps {
  input: {
    value: string[]
    onChange: (v: string[]) => void
  }
  defaultOptions?: string[]
  placeholder?: string
  isForm?: boolean
}

interface Option {
  value: string
  label: string
}

export const UserNameSelect = observer((props: IProps) => {
  const { defaultOptions, input, isForm, placeholder } = props
  const { userStore } = useCommonStores().stores
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Option[]>([])

  const loadOptions = async (inputVal: string) => {
    // if there is no user input, use defaultOptions prop
    if (inputVal == '') {
      const selectOptions = defaultOptions?.length
        ? defaultOptions
            .filter((user) => user != '')
            .map((user) => ({
              value: user,
              label: user,
            }))
        : []
      setOptions(selectOptions)
    } else {
      const usersStartingWithInput: IUserPP[] =
        await userStore.getUsersStartingWith(inputVal, USER_RESULTS_LIMIT)
      const selectOptions = usersStartingWithInput.map((user) => ({
        value: user.userName,
        label: user.userName,
      }))
      setOptions(selectOptions)
    }
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
    <Select
      variant={isForm ? 'form' : undefined}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={(v: Option[]) => input.onChange(v.map((user) => user.value))}
      onInputChange={setInputValue}
      isClearable={true}
      isMulti={true}
    />
  )
})
