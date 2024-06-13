import { valuesAreDeepEqual } from '../Utils'

import type { IUserDB } from '../models'

export const hasKeyDetailsChanged = (prevUser: IUserDB, user: IUserDB) => {
  const detailsChanged = [
    prevUser.displayName !== user.displayName,
    prevUser.location?.countryCode !== user.location?.countryCode,
    hasCoverImagesChanged(prevUser, user),
    prevUser.badges?.verified !== user.badges?.verified,
    prevUser.badges?.supporter !== user.badges?.supporter,
  ]
  return !!detailsChanged.find((detail) => detail === true)
}

export const hasCoverImagesChanged = (prevUser: IUserDB, user: IUserDB) => {
  if (!prevUser.coverImages && !user.coverImages) return false

  if (prevUser.coverImages && user.coverImages) {
    if (!prevUser.coverImages[0] && !user.coverImages[0]) return false

    return !valuesAreDeepEqual(prevUser.coverImages, user.coverImages)
  }

  return false
}
