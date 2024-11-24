describe('[How To]', () => {
  beforeEach(() => {
    cy.visit('/questions')
  })

  describe('[By Everyone]', () => {
    it('should clear filters after navigation', () => {
      cy.get('[data-cy=questions-search-box]').clear().type(`raincoat`)
      cy.url().should('include', 'q=raincoat')
      cy.url().should('include', 'sort=MostRelevant')

      cy.get('[data-cy=category-select]').click()
      cy.get('[id^="react-select-"]').contains('screening').click()
      cy.url().should('include', 'category=categoryoix4r6grC1mMA0Xz3K')

      cy.get('[data-cy=page-link]').contains('Questions').click()

      cy.wait(2000)
      cy.get('[data-cy=questions-search-box]')
        .invoke('val')
        .then((searchText) => expect(searchText).to.equal(''))
      cy.get('[data-cy=category-select]').should('have.value', '')
    })

    it('should remove category filter after back navigation', () => {
      cy.get('[data-cy=category-select]').click()
      cy.get('[id^="react-select-"]').contains('screening').click()
      cy.url().should('include', 'category=categoryoix4r6grC1mMA0Xz3K')
      cy.go('back')
      cy.get('[data-cy=category-select]').should('have.value', '')
      cy.url().should('not.include', 'category=categoryoix4r6grC1mMA0Xz3K')
    })

    it('should remove search filter after back navigation', () => {
      cy.get('[data-cy=questions-search-box]').clear().type(`raincoat`)
      cy.url().should('include', 'q=raincoat')

      cy.go('back')
      cy.wait(2000)

      cy.get('[data-cy=questions-search-box]')
        .invoke('val')
        .then((searchText) => expect(searchText).to.equal(''))
      cy.url().should('not.include', 'q=raincoat')
    })

    it('should show question list items after visit a question', () => {
      cy.get('[data-cy=question-list-item]:eq(0)').click()
      cy.get('[data-cy=question-title]').should('be.visible')
      cy.go('back')
      cy.get('[data-cy=question-list-item]').should('be.visible')
    })

    it('should load more questions', () => {
      cy.get('[data-cy=question-list-item]:eq(21)').should('not.exist')
      cy.get('[data-cy=load-more]').click()
      cy.get('[data-cy=question-list-item]:eq(21)').should('exist')
    })
  })
})
