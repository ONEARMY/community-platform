#!/usr/bin/env node

/*global require, console*/

const { exec } = require('child_process')

const command =
  'firebase emulators:export --project demo-community-platform-emulated --force ./dump'

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('exec error: ' + error)
    return
  }
  if (stdout) {
    console.log('stdout: ' + stdout)
  }
  if (stderr) {
    console.error('stderr: ' + stderr)
  }
})
