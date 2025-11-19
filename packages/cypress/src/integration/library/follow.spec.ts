describe('[Library]', () => {
  const libraryListUrl = '/library'

  describe('[By Everyone]', () => {
    it('[Follow button on list]', () => {
      cy.visit(libraryListUrl)
      cy.step('Should not show follow icon when not logged in')
      cy.get('[data-cy="card"]', { timeout: 10000 })
        .should('have.length.at.least', 1)
        .first()
        .within(() => {
          cy.get('[data-cy="follow-button"]').should('not.exist')
          cy.get('[data-cy="follow-redirect"]').should('not.exist')
        })
    })
  })

  describe('[By Authenticated]', () => {
    it('[Follow icon on list view]', () => {
      cy.signIn('demo_beta_tester@example.com', 'demo_beta_tester')

      cy.step('Verify follow icon is NOT showing before following')
      cy.visit(libraryListUrl)
      cy.get('[data-cy="card"]', { timeout: 10000 }).should(
        'have.length.at.least',
        1,
      )

      cy.get('[data-cy=library-search-box]').click().type('brick')
      cy.get('[data-cy="card"]').should('exist')

      cy.contains('[data-cy="card"]', 'Make an interlocking brick').within(
        () => {
          cy.get('[data-cy="follow-button"]').should('not.exist')
        },
      )

      cy.step('Go to the project detail page and click follow')
      cy.visit('/library/make-an-interlocking-brick')
      cy.get('[data-cy="follow-button"]').first().click()
      cy.wait(2000)

      cy.step('Navigate back to list and verify follow icon now shows')
      cy.visit(libraryListUrl)
      cy.get('[data-cy=library-search-box]').click().type('brick')
      cy.get('[data-cy="card"]').should('exist')

      cy.contains('[data-cy="card"]', 'Make an interlocking brick').within(
        () => {
          cy.get('[data-cy="follow-button"]').should('exist')
        },
      )
    })
  })
})
