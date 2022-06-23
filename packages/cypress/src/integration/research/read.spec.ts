describe('[Research]', () => {
  const SKIP_TIMEOUT = { timeout: 300 }
  const totalResearchCount = 1

  describe('[List research articles]', () => {
    const researchArticleUrl = '/research/qwerty'
    beforeEach(() => {
      cy.visit('/research')
    })

    it('[By Everyone]', () => {
      cy.step('All research articles are shown')

      cy.get('[data-cy="ResearchListItem"]')
        .its('length')
        .should('be.eq', totalResearchCount)

      cy.step('Research cards has basic info')
      cy.get(
        `[data-cy="ResearchListItem"] a[href="${researchArticleUrl}"]`,
      ).within(() => {
        cy.contains('qwerty').should('be.exist')
        cy.contains('event_reader').should('be.exist')
        cy.contains('1 update').should('be.exist')
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
  })
})
