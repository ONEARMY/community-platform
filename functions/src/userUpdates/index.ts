import * as functions from 'firebase-functions'

import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import { backupUser } from './backupUser'
import { updateDiscussionComments } from './updateDiscussionComments'
import { updateMapPins } from './updateMapPins'

import type { IUserDB } from 'oa-shared/models/user'
import type { IDBDocChange } from '../models'

/*********************************************************************
 * Side-effects to be carried out on various user updates, namely:
 * - create user revision history
 * - update map pin location on change
 * - update library creator flag on change
 * - update userName and flag on any comments made by user
 *********************************************************************/
export const handleUserUpdates = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async (change, _) => {
    await backupUser(change)
    await updateDocuments(change)
  })

const isUserCountryDifferent = (prevInfo: IUserDB, info: IUserDB) => {
  const prevCountryCode = prevInfo.location?.countryCode
  const newCountryCode = info.location?.countryCode
  const prevCountry = prevInfo.country
  const newCountry = info.country

  return prevCountryCode !== newCountryCode || prevCountry !== newCountry
}

async function updateDocuments(change: IDBDocChange) {
  const info = (change.after.exists ? change.after.data() : {}) as IUserDB
  const prevInfo = (change.before.exists ? change.before.data() : {}) as IUserDB

  const newCountryCode = info.location?.countryCode
  const newCountry = info.country
  const prevDeleted = prevInfo._deleted || false
  const deleted = info._deleted || false

  const didChangeCountry = isUserCountryDifferent(prevInfo, info)
  if (didChangeCountry) {
    // Update country flag in user's created projects
    const country = newCountryCode ? newCountryCode : newCountry.toLowerCase()
    await updatePostsCountry(info._id, country)
  }

  await updateDiscussionComments(prevInfo, info)
  await updateMapPins(prevInfo, info)

  const didDelete = prevDeleted !== deleted && deleted
  if (didDelete) {
    await deleteMapPin(info._id)
  }
}

async function updatePostsCountry(userId: string, country: IUserDB['country']) {
  if (!userId || !country) {
    console.error('Missing information to set creatorCountry')
    return false
  }
  console.log('Updating items from user', userId, 'to country:', country)

  // 1. Update Library
  let updatedCount = 0
  const querySnapshot = await db
    .collection(DB_ENDPOINTS.library)
    .where('_createdBy', '==', userId)
    .get()

  if (querySnapshot) {
    for (const doc of querySnapshot.docs) {
      try {
        await doc.ref.update({
          creatorCountry: country,
          _modified: new Date().toISOString(),
        })
        updatedCount += 1
      } catch (error) {
        console.error('Error updating Library Country: ', error)
      }
    }
  } else {
    console.log('Error getting user library items')
  }
  console.log('Successfully updated', updatedCount, 'library projects!')

  // 2. Update Researches
  let updatedResearchCount = 0
  const researchQuerySnapshot = await db
    .collection(DB_ENDPOINTS.research)
    .where('_createdBy', '==', userId)
    .get()
  if (researchQuerySnapshot) {
    for (const doc of researchQuerySnapshot.docs) {
      try {
        await doc.ref.update({
          creatorCountry: country,
          _modified: new Date().toISOString(),
        })
        updatedResearchCount += 1
      } catch (error) {
        console.error('Error updating Research: ', error)
      }
    }
  } else {
    console.log('Error getting user researches')
    return false
  }
  console.log('Successfully updated', updatedResearchCount, 'researches!')

  // 3. Update Questions
  let updatedQuestionCount = 0
  const questionQuerySnapshot = await db
    .collection(DB_ENDPOINTS.questions)
    .where('_createdBy', '==', userId)
    .get()
  if (questionQuerySnapshot) {
    for (const doc of questionQuerySnapshot.docs) {
      try {
        await doc.ref.update({
          creatorCountry: country,
          _modified: new Date().toISOString(),
        })
        updatedQuestionCount += 1
      } catch (error) {
        console.error('Error updating Question: ', error)
      }
    }
  } else {
    console.log('Error getting user questions')
    return false
  }
  console.log('Successfully updated', updatedQuestionCount, 'questions!')

  return false
}

async function deleteMapPin(_id: string) {
  const pin = await db.collection(DB_ENDPOINTS.mappins).doc(_id).get()

  if (pin.exists) {
    try {
      await pin.ref.update({
        _deleted: true,
        _modified: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error marking map pin as deleted: ', error)
    }
  }
}
