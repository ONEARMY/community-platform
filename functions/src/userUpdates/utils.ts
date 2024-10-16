import { valuesAreDeepEqual } from '../Utils'

import type { IUserDB } from 'oa-shared/models/user'

export const hasDetailsChanged = (
  prevUser: IUserDB,
  user: IUserDB,
): boolean[] => {
  return [
    prevUser.displayName !== user.displayName,
    hasUserImageChanged(prevUser, user),
    prevUser.badges?.verified !== user.badges?.verified,
    prevUser.badges?.supporter !== user.badges?.supporter,
  ]
}

export const hasLocationDetailsChanged = (
  prevUser: IUserDB,
  user: IUserDB,
): boolean[] => {
  return [
    prevUser.location?.countryCode !== user.location?.countryCode,
    prevUser.country !== user.country,
  ]
}

export const hasDetailsForCommentsChanged = (
  prevUser: IUserDB,
  user: IUserDB,
): boolean => {
  const detailsChanged = [
    ...hasDetailsChanged(prevUser, user),
    ...hasLocationDetailsChanged(prevUser, user),
  ]
  return !!detailsChanged.find((detail) => detail === true)
}

export const hasDetailsForMapPinChanged = (
  prevUser: IUserDB,
  user: IUserDB,
): boolean => {
  const detailsChanged = [
    prevUser._lastActive !== user._lastActive,
    prevUser.about !== user.about,
    prevUser.displayName !== user.displayName,
    prevUser.isContactableByPublic !== user.isContactableByPublic,
    prevUser.profileType !== user.profileType,
    prevUser.workspaceType !== user.workspaceType,
    hasUserTagsChanged(prevUser, user),
    ...hasDetailsChanged(prevUser, user),
    ...hasLocationDetailsChanged(prevUser, user),
  ]
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
}

export const hasUserTagsChanged = (
  prevUser: IUserDB,
  user: IUserDB,
): boolean => {
  return !valuesAreDeepEqual(prevUser.tags, user.tags)
}

export const getCreatorImage = (userImage: IUserDB['userImage']) => {
  return userImage?.downloadUrl || null
}

export const getFirstCoverImage = (coverImages: IUserDB['coverImages']) => {
  return coverImages?.[0]?.downloadUrl || null
}
