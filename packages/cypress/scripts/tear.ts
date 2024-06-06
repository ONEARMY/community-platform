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
  await deleteDatabase()
}

async function deleteDatabase() {
  console.log(`Deleting database prefix ${process.env.DB_PREFIX}`)
  try {
    await TestDB.clearDB()
    console.log('Database deleted successfully')
  } catch (error) {
    handleError(error)
  }
}

function handleError(error: any) {
  console.error(error)
  process.exit(1)
}
