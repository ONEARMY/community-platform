describe('[Research]', () => {
  describe('[Follow a research article]', () => {
    const researchArticleUrl = '/research/qwerty'
    beforeEach(() => {
      cy.visit(researchArticleUrl)
    })

    describe('[By Everyone]', () => {
      it('[Follow button]', () => {
        cy.step('Should redirect to sign in')
        cy.get('[data-cy="follow-button"]').should('not.exist')
        cy.get('[data-cy="follow-redirect"]').should('exist')
        cy.get(`[data-cy="follow-redirect"]`)
          .first()
          .click()
          .url()
          .should('include', '/sign-in')
      })
    })

    describe('[By Authenticated]', () => {
      it('[Follow button]', () => {
        cy.step('Should exist')
        cy.login('demo_beta_tester@example.com', 'demo_beta_tester')
        cy.get('[data-cy="follow-redirect"]').should('not.exist')
        cy.get('[data-cy="follow-button"]')
          .should('exist')
          .should('contain.text', 'Follow')

        cy.step('Should follow on click')
        cy.get('[data-cy="follow-button"]')
          .first()
          .click()
          .should('contain.text', 'Following')

        cy.step('Should persist follow status on reload')
        cy.visit(researchArticleUrl)
        cy.get('[data-cy="follow-button"]')
          .first()
          .click()
          .should('contain.text', 'Following')

        cy.step('Should unfollow on click')
        cy.get('[data-cy="follow-button"]')
          .first()
          .click()
          .should('contain.text', 'Follow')
      })
    })
  })
})
