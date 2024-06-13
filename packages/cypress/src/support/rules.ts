Cypress.on('uncaught:exception', (err) => {
  // This should be temporary while we sort out a new approach with our
  // indexing rules applied.
  if (err.message.includes('The query requires an index.')) {
    return false
  }
  if (err.message.includes('No document to update')) {
    return false
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
})
