import { DB_ENDPOINTS } from 'oa-shared'

import { db } from '../Firebase/firestoreDB'
import {
  getCreatorImage,
  getFirstCoverImage,
  getValidTags,
  hasDetailsForMapPinChanged,
} from './utils'

import type { IUserDB } from 'oa-shared/models/user'

export const updateMapPins = async (prevUser: IUserDB, user: IUserDB) => {
  if (!hasDetailsForMapPinChanged(prevUser, user)) {
    return
  }

  const snapshot = await db
    .collection(DB_ENDPOINTS.mappins)
    .where('_id', '==', user._id)
    .get()

  if (snapshot.empty) {
    return
  }

  const {
    _id,
    _lastActive,
    about,
    badges,
    country,
    coverImages,
    displayName,
    isContactableByPublic,
    location,
    openToVisitors,
    profileType,
    userImage,
    workspaceType,
  } = user
  const creatorImage = getCreatorImage(userImage)
  const coverImage = getFirstCoverImage(coverImages)
  const countryCode = location?.countryCode || country || ''
  const tags = user.tags ? getValidTags(user.tags) : []

  const creator = {
    _id,
    _lastActive,
    about,
    badges,
    countryCode,
    coverImage,
    displayName,
    isContactableByPublic,
    openToVisitors,
    profileType,
    tags,
    userImage: creatorImage,
    workspaceType,
  }

  // Only one expected
  for (const doc of snapshot.docs) {
    await doc.ref.update({ creator })
  }
  return console.log(`Updated ${_id}'s mapPin`)
}
