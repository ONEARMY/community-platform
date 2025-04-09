describe('[News.Search]', () => {
  beforeEach(() => {
    cy.visit('/news')
  })

  describe('[By Everyone]', () => {
    it('Searches', () => {
      // cy.step('Can search for items')
      // cy.get('[data-cy=news-search-box]').clear().type(`deal`)
      // cy.url().should('include', 'q=deal')
      // cy.url().should('include', 'sort=MostRelevant')
      // cy.get('[data-cy=news-list-item]').its('length').should('be.eq', 1)
      // cy.get('[data-cy=HightedText]').contains('deal')
      // cy.step('Can clear search')
      // cy.get('[data-cy=close]').click()
      // cy.url().should('not.include', 'q=deal')
      // cy.get('[data-cy=news-search-box]').should('be.empty')
      // cy.get('[data-cy=news-list-item]').its('length').should('be.above', 1)
      // cy.step('should remove search filter after back navigation')
      // cy.get('[data-cy=news-search-box]').clear().type(`deal`)
      // cy.wait(2000)
      // cy.get('[data-cy=news-list-item]').click()
      // cy.go('back')
      // cy.url().should('not.include', 'q=deal')
    })

    // it('should load more news', () => {
    //   cy.get('[data-cy=news-list-item]:eq(21)').should('not.exist')
    //   cy.get('[data-cy=load-more]').click()
    //   cy.get('[data-cy=news-list-item]:eq(21)').should('exist')
    // })
  })
})
