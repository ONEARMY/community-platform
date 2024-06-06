#!/usr/bin/env ts-node
import * as dotenv from 'dotenv'

import { TestDB } from '../src/support/db/firebase'

dotenv.config()

// Prevent unhandled errors being silently ignored
process.on('unhandledRejection', (err) => {
  console.error('There was an uncaught error', err)
  process.exitCode = 1
})

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

async function main() {
  console.log('testeeee', process.env.DB_PREFIX)
  //await deleteDatabase()
}

async function deleteDatabase() {
  console.log(`Deleting database prefix ${process.env.DB_PREFIX}`)
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 10000)
    TestDB.clearDB()
      .then(() => {
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
    .then(() => {
      console.log('Database deleted successfully')
    })
    .catch((error) => {
      console.error('Database deleting failed:', error)
      throw error
    })
}
