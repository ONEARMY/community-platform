describe('[How To]', () => {
    beforeEach(() => {
      cy.visit('/how-to')
    })

    it('[By Everyone]', () => {
        cy.get('[data-cy=how-to-search-box]')
        .clear()
        .type(`raincoat`)

        cy.url().should('include', 'search=raincoat')

        cy.get('[data-cy=page-link]')
        .contains('Events')
        .click()

        cy.get('[data-cy=page-link]')
        .contains('How-to')
        .click()

        cy.get('[data-cy=how-to-search-box]')
        .invoke('val')
        .then(searchText => expect(searchText).to.equal(''));
    })
})