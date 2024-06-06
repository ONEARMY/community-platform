#!/usr/bin/env ts-node
import * as dotenv from 'dotenv'

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
}
