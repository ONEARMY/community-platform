/** Check that developer environment setup as expected */
function envCheck() {
  const tests = [
    {
      message: 'Use Yarn (not npm)',
      severity: 'failure',
      exec: () => /yarn/.test(process.env.npm_execpath),
    },
    {
      message: 'Use Node v18',
      severity: 'failure',
      exec: () => process.versions.node.split('.')[0] === '18',
    },
  ]

  let failures = 0

  console.log('\n')
  for (const test of tests) {
    let icon = '✅'
    let message = test.message
    const passed = test.exec()
    if (!passed) {
      if (test.severity === 'failure') {
        icon = '❌'
        failures = failures + 1
      } else {
        icon = '⚠️'
        message = '(Recommended) ' + message
        console.log(icon, '', message)
      }
    }
  }
  console.log('\n')

  if (failures > 0) {
    console.log(
      '💻 Please setup your dev environment to meet requirements\n\nFor more info see:\n\n',
      'https://onearmy.github.io/community-platform/\n\n',
    )
    process.exit(1)
  }
}
if (require.main === module) {
  envCheck()
}
exports.envCheck = envCheck
