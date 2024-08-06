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

  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
})
