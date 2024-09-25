import type { IUserPP } from 'oa-shared'
import type { UserStore } from 'src/stores/User/user.store'

const USER_RESULTS_LIMIT = 20

export interface IOption {
  value: string
  label: string
}

export const loadUserNameOptions = async (
  userStore: UserStore,
  defaultOptions: string[] | undefined,
  inputValue: string,
) => {
  // if there is no user input, use defaultOptions
  if (inputValue == '') {
    const selectOptions: IOption[] = defaultOptions?.length
      ? defaultOptions
          .filter((user) => user != '')
          .map((user) => ({
            value: user,
            label: user,
          }))
      : []
    return selectOptions
  } else {
    const usersStartingWithInput: IUserPP[] =
      await userStore.getUsersStartingWith(inputValue, USER_RESULTS_LIMIT)
    const selectOptions: IOption[] = usersStartingWithInput.map((user) => ({
      value: user.userName,
      label: user.userName,
    }))
    return selectOptions
  }
}
