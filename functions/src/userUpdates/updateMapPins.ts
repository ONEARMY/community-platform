import { DB_ENDPOINTS } from 'oa-shared'

import { db } from '../Firebase/firestoreDB'
import {
  getCreatorImage,
  getFirstCoverImage,
  hasDetailsForMapPinChanged,
} from './utils'

import type { IUserDB } from '../models'

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
    profileType,
    subType,
    userImage,
    location,
  } = user
  const creatorImage = getCreatorImage(userImage)
  const coverImage = getFirstCoverImage(coverImages)
  const countryCode = location?.countryCode || country || ''

  const creator = {
    _lastActive,
    about,
    badges,
    countryCode,
    coverImage,
    displayName,
    isContactableByPublic,
    profileType,
    subType,
    userImage: creatorImage,
  }

  // Only one expected
  for (const doc of snapshot.docs) {
    await doc.ref.update({ creator })
  }
  return console.log(`Updated ${_id}'s mapPin`)
}
