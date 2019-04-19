import axios from 'axios'
import { BPMember } from './BPMember.model'
import * as db from '../Firebase/realtimeDB'
const endpoint = 'https://davehakkens.nl/wp-json/buddypress/v1/members'

// get list of DH site user ids based on their mention names
export const updateDHUserIds = async () => {
  console.log('updating ids')
  const existingIDs = await db.get('_DHSiteUserIDs')
  const totalExisting = Object.keys(existingIDs).length
  console.log('total existing', totalExisting)
  // use initial request to see how many total
  const initialRequest = await sendRecordRequest(1, 1)
  const totalOverall = Number(initialRequest.headers['x-wp-totalpages'])
  console.log('total overall', totalOverall)
  const pagesToFetch = Math.ceil((totalOverall - totalExisting) / 100)
  console.log('fetching pages', pagesToFetch)
  await migrateDHUserMeta(pagesToFetch)
}
// 70134
export const getUserProfile = async (id: number) => {
  const req = await axios.get(endpoint, {
    params: {
      per_page: 1,
      user_ids: [id],
    },
  })
  const profile = req.data[0]
  // not sharing email between sites as user has registered new account
  if (profile.hasOwnProperty('email')) {
    delete profile.email
  }
  return profile
}

// generic function to get all endpoint - can be extended for any wpapi function calls
// such as pages, taxonomies etc
async function migrateDHUserMeta(endPage: number) {
  console.log(`fetching [${endPage}] pages of profile data`)
  // will send of batches of 100 from here on
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

function extractBPIds(records: BPMember[]) {
  const recordObject = {}
  records.forEach(r => {
    recordObject[r.mention_name] = r.id
  })
  return recordObject
}

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
