#!/usr/bin/env node

// Continuously copy the log files into a common folder
// making it easier to export them.
//
// This script knows the folder structure of the container.
//
// Symbolic links did not work.

const fs = require('fs')

const isDebug = false

log('setup...')

const files = [
  'database-debug.log',
  'firebase-debug.log',
  'firestore-debug.log',
  'pubsub-debug.log',
  'ui-debug.log'
]

// clear the files so the they are also cleared on the host.
files.forEach((filename) => {
  fs.writeFileSync('/app/' + filename, '')
})

fs.watch('/app', {}, (event, filename) => {
  log('event: ' + event)
  log('filename: ' + filename)

  if (files.includes(filename)) {
    log('updating... ' + filename)
    fs.copyFileSync('/app/' + filename, '/app/logs/' + filename)
  }
})

function log(statement) {
  if (isDebug) {
    console.log('[LINK-LOGS] ' + statement)
  }
}