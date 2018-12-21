import csvtojson from 'csvtojson'
import { writeFile } from 'fs'
// import LEGACY_USERS from './data/subset_0.json'
import SERVICE_ACCOUNT from './config/config'
import 'log-update'
import * as admin from 'firebase-admin'
import logUpdate = require('log-update')

/*
A few quick and messy functions to parse legacy user csv, split into chunks of 10,000, and save as json
The json files can then be used to bulk import into the database

requires data/one-army-users.csv which should be formatted with the column headings shown below

NOTE, IF USING FOR FIRST TIME WILL NEED TO COMMENT OUT LEGACY_USERS REFS AND POPULATE FROM createUserFileChunks()

*/
admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT),
})
const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

const legacyDataFormats = {
  legacy_id: 'number',
  login: 'string',
  password: 'string',
  password_alg: 'string',
  email: 'string',
  legacy_registered: 'string',
  display_name: 'string',
  first_name: 'string',
  last_name: 'string',
  nickname: 'string',
  country: 'string',
}

const init = async () => {
  /* only one of these functions can be run at a time, the first creates files for import
   the second imports them, requires uncomment of the named function also */
  createUserFileChunks()
  // populateLegacyData()
}

// parse csv file containing legacy user data and split into json files with 10,000 entries each
// this was initially done to keep within free quotas, however possibly not required as still very cheap
// could work with just a single file
const createUserFileChunks = async () => {
  console.log('creating file chunks')
  const users: any[] = await csvtojson({
    colParser: legacyDataFormats,
    checkType: true,
  }).fromFile('src/data/one-army-users.csv')
  const chunkSize = 10000
  const chunks = splitArrayToChunks(users, chunkSize)
  chunks.forEach((chunk, i) => {
    writeFile(`src/data/subset_${i}.json`, JSON.stringify(chunk), () => null)
  })
}

// This function is only required for initial writing of legacy profile to the database
// files can be written in chunks of max 500 and cost $0.18 per 100k

// const populateLegacyData = async () => {
//   const users: any[] = LEGACY_USERS
//   let i = 0
//   // write in batch of 500 (due to quota limits)
//   const chunks = splitArrayToChunks(users, 500)
//   logUpdate(`Preparing ${LEGACY_USERS.length} users for upload`)
//   for (const chunk of chunks) {
//     try {
//       await writeUserBatch(chunk)
//       i = i + chunk.length
//       logUpdate(`${i}/${LEGACY_USERS.length} users uploaded`)
//     } catch (error) {
//       throw new Error(JSON.stringify(error))
//     }
//   }
// }

const writeUserBatch = async (users: any[]) => {
  const batch = db.batch()
  users.forEach(async user => {
    if (user.email) {
      const ref = db.collection('_legacyUsers').doc(user.email)
      batch.set(ref, user)
    }
  })
  return batch.commit()
}

// take an array and return an array of arrays of a given size
const splitArrayToChunks = (arr: any[], chunkSize: number) => {
  const chunks = Math.floor(arr.length / chunkSize)
  const subsets = []
  for (let i = 0; i <= chunks; i++) {
    const chunkEnd = Math.min(arr.length, chunkSize * (i + 1))
    const subset = [...arr.slice(chunkSize * i, chunkEnd)]
    subsets.push(subset)
  }
  return subsets
}

init()
