Cypress.on('uncaught:exception', (err) => {
  const skipErrors = [
    'The query requires an index.',
    'No document to update',
    'KeyPath previousSlugs',
    'KeyPath slug',
  ]

  const foundSkipError = skipErrors.find((error) => err.message.includes(error))

  if (foundSkipError) {
    return false
  }

  // Cypress and React Hydrating the document don't get along
  // for some unknown reason. Hopefully, we figure out why eventually.
  // Maybe https://github.com/cypress-io/cypress/issues/27204#issuecomment-2224833564
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #423/.test(err.message)
  ) {
    return false
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
})
