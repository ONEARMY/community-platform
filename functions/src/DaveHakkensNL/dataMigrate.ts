import axios from 'axios'
import { BPMember } from './BPMember.model'
import * as db from '../Firebase/realtimeDB'
const endpoint = 'https://davehakkens.nl/wp-json/buddypress/v1/members'

// generic function to get all endpoint - can be extended for any wpapi function calls
// such as pages, taxonomies etc
export const migrateDHUserMeta = async () => {
  // use an initial request to see total numbers of pages from header
  console.log('migrating user data')
  const initialRequest = await sendRecordRequest(1)
  updateBPDataRecords(initialRequest.data as BPMember[])
  // use meta to run subsequent queries
  const totalPages = Number(initialRequest.headers['x-wp-totalpages'])
  if (totalPages !== 1) {
    for (let i = 2; i <= totalPages; i++) {
      console.log(`${i}/${totalPages}`)
      const req = await sendRecordRequest(i)
      updateBPDataRecords(req.data)
    }
  }
}

function sendRecordRequest(pageNumber: number) {
  return axios.get(endpoint, {
    params: {
      per_page: 100,
      page: pageNumber,
    },
  })
}

async function updateBPDataRecords(records: BPMember[]) {
  const recordObject = {}
  records.forEach(r => {
    if (r.hasOwnProperty('email')) {
      delete r.email
    }
    recordObject[r.mention_name] = r
  })
  // populate database
  console.log('updating records')
  await db.update('legacyUsers', recordObject)
  console.log('records updated')
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
