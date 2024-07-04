describe('[Research]', () => {
  const researchArticleUrl = '/research/qwerty'
  beforeEach(() => {
    cy.visit(researchArticleUrl)
  })

  describe('[By Everyone]', () => {
    it('[Follow button]', () => {
      cy.step('Should redirect to sign in')
      cy.get('[data-cy="follow-button"]').should('not.exist')
      cy.get('[data-cy="follow-redirect"]').first().click()
      cy.url().should('include', '/sign-in')
    })
  })

  describe('[By Authenticated]', () => {
    it('[Follow button]', () => {
      cy.step('Should exist')
      cy.login('demo_beta_tester@example.com', 'demo_beta_tester')
      cy.get('[data-cy="follow-redirect"]').should('not.exist')
      cy.get('[data-cy="follow-button"]')
        .should('be.visible')
        .should('contain.text', 'Follow')

      cy.step('Should follow on click')
      cy.get('[data-cy="follow-button"]').first().click()
      cy.get('[data-cy="follow-button"]')
        .first()
        .should('contain.text', 'Following')

      cy.step('Should persist follow status on reload')
      cy.visit(researchArticleUrl)
      cy.get('[data-cy="follow-button"]')
        .first()
        .should('contain.text', 'Following')
    })
  })
})
