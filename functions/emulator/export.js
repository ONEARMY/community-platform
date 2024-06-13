#!/usr/bin/env node

const { exec } = require('child_process')

const command =
  'firebase emulators:export --project demo-community-platform-emulated --force ./dump'

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.error(`stderr: ${stderr}`)
})
