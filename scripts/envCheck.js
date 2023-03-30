/*eslint-env node*/
/** Check that developer environment setup as expected */
function envCheck() {
  const tests = [
    {
      message: 'Use Yarn (not npm)',
      exec: () => /yarn/.test(process.env.npm_execpath),
    },
    {
      message: 'Use Node v18',
      exec: () => process.versions.node.split('.')[0] === '18',
    },
  ]

  let failures = 0
  let output = '\n'

  for (const test of tests) {
    if (!test.exec()) {
      failures = failures + 1
      output += `❌ ${test.message}\n`
    } else {
      output += `✅ ${test.message}\n`
    }
  }

  if (failures > 0) {
    console.log(output)
    console.log(
      '💻 Please setup your dev environment to meet requirements\n\nFor more info see:',
    )
    console.log('https://onearmy.github.io/community-platform/\n\n')
    process.exit(1)
  }
}
if (require.main === module) {
  envCheck()
}
exports.envCheck = envCheck
