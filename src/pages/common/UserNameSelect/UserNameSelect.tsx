import { useState, useEffect } from 'react'
import { useCommonStores } from 'src/index'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import type { IUserPP } from 'src/models'

interface IProps {
  input: any
  defaultOptions?: string[]
  placeholder?: string
  isForm?: boolean
}

interface Option {
  value: string
  label: string
}

export const UserNameSelect = observer(
  ({ input, defaultOptions, placeholder, isForm }: IProps) => {
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
          await userStore.getUsersStartingWith(inputVal, 20)
        const selectOptions = usersStartingWithInput
          .map((user) => user.userName)
          .filter((user) => user && user.startsWith(inputVal))
          .map((user) => ({
            value: user,
            label: user,
          }))
        setOptions(selectOptions)
      }
    }

    // Effect to load options whenever the input value changes
    useEffect(() => {
      loadOptions(inputValue)
    }, [inputValue])

    return (
      <Select
        variant={isForm ? 'form' : undefined}
        options={options}
        placeholder={placeholder}
        value={
          input.value?.length
            ? input.value.map((user) => ({
                value: user,
                label: user,
              }))
            : []
        }
        onChange={(v) => input.onChange(v.map((user) => user.value))}
        onInputChange={setInputValue}
        isClearable={true}
        isMulti={true}
      />
    )
  },
)
