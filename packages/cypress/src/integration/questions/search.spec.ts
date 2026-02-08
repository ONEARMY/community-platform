describe('[Questions]', () => {
  beforeEach(() => {
    cy.visit('/questions');
  });

  describe('[By Everyone]', () => {
    it('Searches', () => {
      cy.wait(2000);
      cy.step('Can search for items');
      cy.get('[data-cy=questions-search-box]').clear().type(`deal`);
      cy.url().should('include', 'q=deal');
      cy.url().should('include', 'sort=MostRelevant');
      cy.get('[data-cy=question-list-item]').its('length').should('be.eq', 1);
      cy.get('[data-cy=HightedText]').contains('deal');

      cy.step('Can clear search');
      cy.get('[data-cy=close]').click();
      cy.url().should('not.include', 'q=deal');
      cy.get('[data-cy=questions-search-box]').should('be.empty');
      cy.get('[data-cy=question-list-item]').its('length').should('be.above', 1);

      cy.step('should remove search filter after back navigation');
      cy.get('[data-cy=questions-search-box]').clear().type(`deal`);
      cy.wait(2000);
      cy.get('[data-cy=question-list-item]').click();
      cy.go('back');
      cy.url().should('not.include', 'q=deal');
    });

    it('Filters', () => {
      cy.step('Can select a category to limit items displayed');
      cy.get('[data-cy=CategoryHorizonalList]').within(() => {
        cy.contains('Machines').click();
      });
      cy.get('[data-cy=CategoryHorizonalList-Item-active]');
      cy.url().should('include', 'category=');

      cy.step('Can remove the category filter by selecting it again');
      cy.get('[data-cy=CategoryHorizonalList]').within(() => {
        cy.contains('Machines').click();
      });
      cy.url().should('not.include', 'category=');
    });

    it('should show question list items after visit a question', () => {
      cy.get('[data-cy=question-list-item]:eq(0)').click();
      cy.get('[data-cy=question-title]').should('be.visible');
      cy.go('back');
      cy.get('[data-cy=question-list-item]').should('be.visible');
    });

    it('should load more questions', () => {
      cy.get('[data-cy=question-list-item]:eq(21)').should('not.exist');
      cy.get('[data-cy=load-more]').click();
      cy.get('[data-cy=question-list-item]:eq(21)').should('exist');
    });
  });
});
