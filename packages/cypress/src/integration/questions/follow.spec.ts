describe('[Questions]', () => {
  const questionsListUrl = '/questions'
  const questionsUrl = '/questions/the-first-test-question'

  describe('[By Everyone]', () => {
    it('[Follow button on list]', () => {
      cy.visit(questionsListUrl)
      cy.step('Should not show follow icon when not logged in')
      cy.get('[data-cy="question-list-item"]', { timeout: 10000 })
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
      cy.visit(questionsListUrl)
      cy.get('[data-cy="question-list-item"]', { timeout: 10000 }).should(
        'have.length.at.least',
        1,
      )

      cy.contains(
        '[data-cy="question-list-item"]',
        'The first test question?',
      ).within(() => {
        cy.get('[data-cy="follow-button"]').should('not.exist')
      })

      cy.step('Go to the question detail page and click follow')
      cy.visit(questionsUrl)
      cy.get('[data-cy="follow-button"]').first().click()
      cy.wait(2000)

      cy.step('Navigate back to list and verify follow icon now shows')
      cy.visit(questionsListUrl)
      cy.get('[data-cy="question-list-item"]').should('exist')

      cy.contains(
        '[data-cy="question-list-item"]',
        'The first test question?',
      ).within(() => {
        cy.get('[data-cy="follow-button"]').should('exist')
      })
    })
  })
})
