import { valuesAreDeepEqual } from '../Utils'

import type { IUserDB } from '../models'

export const hasDetailsChanged = (
  prevUser: IUserDB,
  user: IUserDB,
): boolean[] => {
  return [
    prevUser.displayName !== user.displayName,
    prevUser.location?.countryCode !== user.location?.countryCode,
    hasUserImageChanged(prevUser, user),
    prevUser.badges?.verified !== user.badges?.verified,
    prevUser.badges?.supporter !== user.badges?.supporter,
  ]
}

export const hasKeyDetailsChanged = (
  prevUser: IUserDB,
  user: IUserDB,
): boolean => {
  const detailsChanged = hasDetailsChanged(prevUser, user)
  return !!detailsChanged.find((detail) => detail === true)
}

export const hasUserImageChanged = (
  prevUser: IUserDB,
  user: IUserDB,
): boolean => {
  if (!prevUser.userImage && !user.userImage) return false

  if (prevUser.userImage && user.userImage) {
    return !valuesAreDeepEqual(prevUser.userImage, user.userImage)
  }

  if (prevUser.userImage && !user.userImage) return true
  if (!prevUser.userImage && user.userImage) return true

  return false
}
