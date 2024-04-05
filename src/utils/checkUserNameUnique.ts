import type { UserStore } from '../stores/User/user.store'

export const checkUserNameUnique = async (
  userStore: UserStore,
  userName: string,
) => {
  const user = await userStore.getUserProfile(userName)
  return user && !user._deleted ? false : true
}
