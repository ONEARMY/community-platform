import { db } from '../Firebase/firestoreDB'

/**
 * Temporary function used to migrate from db V2 docs to V3
    Changes:
    - Add moderation fields to how-tos, events, mappins, users (#847)
    - Format usernames to slug format
    - Add username display fields
    - Update howto and event _createdBy to reflect new users
 */

export const fixV2User = async (username: string) => {
  console.log('fixing user', username)
  if (!username) {
    return `no username provided`
  }
  const d = await db
    .collection('v2_users')
    .doc(username)
    .get()
  if (!d.exists) {
    return `user with username [${username}] not found`
  }
  const doc = d.data() as any
  console.log('user found, updating')
  const newDoc = {
    ...doc,
    _id: formatLowerNoSpecial(doc._id),
    _modified: new Date().toISOString(),
    displayName: doc.userName || doc._id || 'NA',
    userName: formatLowerNoSpecial(doc.userName),
  }
  await db
    .collection('v3_users')
    .doc(newDoc._id)
    .set(newDoc)
  return `[${username}] updated successfully. Try reloading the platform`
}

/*****************************************************************************
 *  Imported functions - note, direct import not working so copied from src
 ******************************************************************************/
// remove special characters from string, also replacing spaces with dashes
const stripSpecialCharacters = (text: string) => {
  return text
    ? text
        .split(' ')
        .join('-')
        .replace(/[^a-zA-Z0-9_-]/gi, '')
    : ''
}

// convert to lower case and remove any special characters
const formatLowerNoSpecial = (text: string) => {
  return stripSpecialCharacters(text).toLowerCase()
}
