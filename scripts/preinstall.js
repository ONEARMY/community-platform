// Check that the user is using yarn instead of npm
// and node version 16

// Note - if using npm v6 this likely won't get called, but may be fixed in the future
// https://github.com/npm/cli/issues/2660
if (!/yarn/.test(process.env.npm_execpath)) {
  console.warn('Please use yarn and not npm')
  process.exit(1)
}
if (!process.version.startsWith('v16')) {
  console.warn(
    '[Warning] - recommend using node v16',
    'you are using ' + process.version,
  )
}
