describe('[How To]', () => {
  beforeEach(() => {
    cy.visit('/how-to')
  })

  describe('[By Everyone]', () => {
    it('should clear filters after navigation', () => {
      cy.get('[data-cy=how-to-search-box]').clear().type(`raincoat`)
      cy.get('[data-cy=category-select]').click()
      cy.get('[id^="react-select-"]').contains('howto_testing').click()

      cy.url().should('include', 'search=raincoat')
      cy.url().should('include', 'category=howto_testing')

      cy.get('[data-cy=page-link]').contains('Events').click()

      cy.get('[data-cy=page-link]').contains('How-to').click()

      cy.get('[data-cy=how-to-search-box]')
        .invoke('val')
        .then((searchText) => expect(searchText).to.equal(''))
      cy.get('[data-cy=category-select]').should('have.value', '')
    })

    it('should remove category filter after back navigation', () => {
      cy.get('[data-cy=category-select]').click()
      cy.get('[id^="react-select-"]').contains('howto_testing').click()

      cy.url().should('include', 'category=howto_testing')

      cy.go('back')

      cy.get('[data-cy=category-select]').should('have.value', '')
      cy.url().should('not.include', 'category=howto_testing')
    })

    it('should remove category filter after back navigation', () => {
      cy.get('[data-cy=how-to-search-box]').clear().type(`h`)

      cy.url().should('include', 'search=h')

      cy.go('back')

      cy.get('[data-cy=how-to-search-box]')
        .invoke('val')
        .then((searchText) => expect(searchText).to.equal(''))
      cy.url().should('not.include', 'search=h')
    })

    it('should show how-to list items after visit a how-to', () => {
      cy.get('[data-cy=card]:eq(0)').click()

      cy.go('back')

      cy.get('[data-cy=card]').should('exist')
    })
  })
})
