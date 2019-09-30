describe('[How To]', () => {
  const SKIP_TIMEOUT = {timeout: 300};
  beforeEach(() => {
    cy.visit('/how-to')
  })

  describe('[List how-tos]', () => {
    it('[By any user]', () => {
      cy.log('No tag is selected')
      cy.get('[data-cy=tag-select]').get('.data-cy__multi-value__label').should('not.exist')

      cy.log('More How-tos button is hidden')
      cy.get('[data-cy=more-how-tos]', SKIP_TIMEOUT).should('be.hidden')

      cy.log('Some how-tos are shown')
      cy.get('[data-cy=card]').its('length').should('be.gte', 15)

      cy.log('How-to cards has basic info')
      cy.get('[data-cy=card] > a[href="/how-to/my-awesome-howto"]', SKIP_TIMEOUT)
        .then(($card) => {
          expect($card).to.have.contain('My awesome how-to')
          expect($card).to.have.contain('By testuser')
        })

      const howtoUrl = '/how-to/my-awesome-howto'
      cy.log(`Open how-to details when click on a how-to ${howtoUrl}`)
      cy.get(`[data-cy=card] > a[href="${howtoUrl}"]`, SKIP_TIMEOUT)
        .click()
      cy.url().should('include', howtoUrl)
    })
  })
})

