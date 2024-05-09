import type { IUserDB } from '../models'

export const hasKeyDetailsChanged = (prevUser: IUserDB, user: IUserDB) => {
  const detailsChanged = [
    prevUser.displayName !== user.displayName,
    prevUser.location?.countryCode !== user.location?.countryCode,
    prevUser.badges?.verified !== user.badges?.verified,
    prevUser.badges?.supporter !== user.badges?.supporter,
  ]
  return !!detailsChanged.find((detail) => detail === true)
}
