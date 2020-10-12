import axios from 'axios'
import { BPMember } from './BPMember.model'
import * as db from '../../Firebase/realtimeDB'
const endpoint = 'https://davehakkens.nl/wp-json/buddypress/v1/members'

/************ Exported Functions ****************************************************
  These functions handle creation of a database that stores and tracks buddypress
  user ids by the user's mention name (as user unlikely to know id number) for lookup.
  Once id has been identified for a user, the getUserProfile function can extract 
  the user's buddypress profile information
 ************************************************************************************/

// identify a user id from their mention name
export const getUserId = async (mention_name: string) => {
  return db.get(`_DHSiteUserIDs/${mention_name}`)
}

// take a user name, lookup their id and return the buddypress profile data with email stripped
export const getDHUserProfile = async (mention_name: string) => {
  try {
    console.log('getting user profile', mention_name)
    const id = (await getUserId(mention_name)) as number
    console.log(`id retrieved: ${mention_name}:${id}`)
    if (!id) {
      throw new Error(`user @${mention_name} not found`)
    }
    const req = await axios.get(endpoint, {
      params: {
        per_page: 1,
        user_ids: [id],
      },
    })
    const profile = req.data[0]
    // not sharing email between sites as user has registered new account
    if (profile && profile.hasOwnProperty('email')) {
      delete profile.email
      return profile
    } else {
      throw new Error(
        'migration not possible - profile contains no public information',
      )
    }
  } catch (error) {
    throw new Error(`user @${mention_name} not found`)
  }
}

// check how many IDs already exist in db and how many are on the buddypress server
// migrate all missing in batches of 100 (storing as mention_name:id pairs)
export const updateDHUserIds = async () => {
  console.log('updating ids')
  const existingIDs = await db.get('_DHSiteUserIDs')
  const totalOnDB = Object.keys(existingIDs).length
  console.log('total on db', totalOnDB)
  // use initial request to see how many total (response has custom header)
  const initialRequest = await sendRecordRequest(1, 1)
  const totalOnBP = Number(initialRequest.headers['x-wp-totalpages'])
  console.log('total on BP', totalOnBP)
  const totalToFetch = totalOnBP - totalOnDB
  const pagesToFetch = Math.ceil(totalToFetch / 100)
  await migrateDHUserIDs(pagesToFetch)
  return `${totalToFetch} updated`
}

/************ Helper Methods ********************************************************

 ************************************************************************************/

//
async function migrateDHUserIDs(endPage: number) {
  console.log(`fetching [${endPage}] pages of profile data`)
  // note, ids retrieved in reverse order so page 1 is newest
  for (let i = 1; i <= endPage; i++) {
    console.log(`${i}/${endPage}`)
    const req = await sendRecordRequest(i)
    const ids = extractBPIds(req.data)
    // await fileUtils.appendJsonToFile('allUsers.json', nextRecords)
    await db.update('_DHSiteUserIDs', ids)
  }
}

// send a http get request to endpoint with paging parameters
function sendRecordRequest(pageNumber: number, perPage: number = 100) {
  return axios.get(endpoint, {
    params: {
      per_page: perPage,
      page: pageNumber,
    },
  })
}

// take batch of user profiles and return single object in format {mention_name:id}
function extractBPIds(records: BPMember[]) {
  const recordObject = {}
  records.forEach(r => {
    recordObject[r.mention_name] = r.id
  })
  return recordObject
}

/************ Deprecated ************************************************************
  (code retained for likely future use)
 ************************************************************************************/

// // callback function that logs completion progress
// function updateProgress(completed: number) {
//   const frames = ['-', '\\', '|', '/']
//   let i = 0
//   const frame = frames[(i = ++i % frames.length)]
//   logUpdate(
//     `
//           ♥♥
//        ${frame} ${completed}% ${frame}
//           ♥♥
//     `,
//   )
//   if (completed === 100) {
//     logUpdate.done()
//   }
// }

// similar as above but operates in parallel - found for large numbers this would
// cause issue with wordpress and break, but keeping for record
// async function _getAllBPRecordsInParallel(startPage: number, endPage: number) {
//   const totalPages = endPage - startPage
//   console.log(`fetching [${endPage - startPage}] pages`)
//   let responses = []
//   if (totalPages > 0) {
//     // make subsequent requests in parallel
//     const requests = []
//     for (let i = startPage; i <= endPage; i++) {
//       requests.push(
//         new Promise((resolve, reject) => {
//           axios
//             .get(endpoint, {
//               params: {
//                 per_page: 100,
//                 page: i,
//               },
//             })
//             .then(resolve)
//             .catch(err => {
//               reject(err)
//             })
//         }),
//       )
//     }
//     try {
//       responses = await progressPromise(requests, updateProgress)
//     } catch (error) {
//       throw new Error(JSON.stringify(error))
//     }
//   }
//   return responses.map(r => r.data)
// }

// // wrapper for promise.all to also track number of completion
// function progressPromise(
//   promises: Promise<any>[],
//   progressCallback: (progress: number) => void,
// ) {
//   let progress = 0
//   const length = promises.length
//   progressCallback(progress)
//   for (const p of promises) {
//     p.then(() => {
//       progress++
//       progressCallback(Math.round((progress / length) * 100))
//     })
//   }
//   return Promise.all(promises)
// }
