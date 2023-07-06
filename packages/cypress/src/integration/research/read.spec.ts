describe('[Research]', () => {
  const SKIP_TIMEOUT = { timeout: 300 }
  const totalResearchCount = 2

  describe('[List research articles]', () => {
    beforeEach(() => {
      cy.visit('/research')
    })

    it('[By Everyone]', () => {
      cy.step('All research articles are shown')

      cy.get('[data-cy="ResearchListItem"]')
        .its('length')
        .should('be.eq', totalResearchCount)
    })
  })

  describe('[Read a research article]', () => {
    const researchArticleUrl = '/research/qwerty'
    beforeEach(() => {
      cy.visit('/research')
    })

    describe('[By Everyone]', () => {
      it('[See all info]', () => {
        cy.step('Research cards has basic info')
        cy.get(
          `[data-cy="ResearchListItem"] a[href="${researchArticleUrl}"]`,
        ).within(() => {
          cy.contains('qwerty').should('be.exist')
          cy.contains('event_reader').should('be.exist')
          cy.get('[data-cy="ItemUpdateText"]').contains('1').should('be.exist')
        })

        cy.step(
          `Open Research details when click on a Research ${researchArticleUrl}`,
        )
        cy.get(
          `[data-cy="ResearchListItem"] a[href="${researchArticleUrl}"]`,
          SKIP_TIMEOUT,
        ).click()
        cy.url().should('include', researchArticleUrl)
      })

      it('[Views only visible for beta-testers]', () => {
        cy.step(`ViewsCounter should not be visible`)
        cy.visit(researchArticleUrl)
        cy.get('[data-cy="ViewsCounter"]').should('not.exist')
      })
    })

    describe('[Beta-tester]', () => {
      it('[Views show on multiple research articles]', () => {
        cy.login('demo_beta_tester@example.com', 'demo_beta_tester')

        cy.step('Views show on first research article')
        cy.visit(researchArticleUrl)
        cy.get('[data-cy="ViewsCounter"]').should('exist')

        cy.step('Go back')
        cy.get('[data-cy="go-back"]:eq(0)').as('topBackButton').click()

        cy.step('Views show on second research article')
        cy.visit('/research/A%20test%20research')
        cy.get('[data-cy="ViewsCounter"]').should('exist')
      })
    })
  })
})
