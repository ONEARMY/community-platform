describe('[Research - List Articles]', () => {
  const researchPageUrl = '/research';

  beforeEach(() => {
    cy.visit(researchPageUrl);
  });

  it('[By Everyone - Lists all research articles]', () => {
    cy.step('Verify page loads with research articles');
    cy.get('[data-cy=ResearchList]').should('be.visible');
    cy.get('[data-cy=ResearchListItem]').should('have.length.greaterThan', 0);
  });

  it('[Search Functionality - Filters articles]', () => {
    const searchTerm = 'test';

    cy.wait(2000);
    cy.step('Type a keyword into the search bar');
    cy.get('[data-cy=research-search-box]').clear().type(searchTerm);

    cy.step('Verify filtered results are displayed');
    cy.get('[data-cy=ResearchListItem]').should('have.length.at.least', 1);
  });

  it('[Search Functionality - Partial word search]', () => {
    cy.wait(2000);
    cy.step('Search with a partial word');
    cy.get('[data-cy=research-search-box]').clear().type('tes');

    cy.step('Verify partial match returns results');
    cy.get('[data-cy=ResearchListItem]').should('have.length.at.least', 1);
  });

  it('[Search Functionality - Sorts by Latest Updated]', () => {
    cy.visit(researchPageUrl + '?sort=LatestUpdated');
    cy.step('Verify sorted results are displayed');
    cy.get('[data-cy=ResearchListItem]').first().contains('A test research');
  });

  it('[Pagination - Navigates to next page]', () => {
    cy.step('Verify pagination is visible');
    cy.get('[data-cy=pagination]').should('be.visible');
    cy.get('[data-cy=pagination-icon-paginationSingleRight]').should('be.visible');

    cy.step('Click next page');
    cy.get('[data-cy=pagination-icon-paginationSingleRight]').click();

    cy.step('Verify page changed');
    cy.url().should('include', 'pageNo=1');
    cy.get('[data-cy=ResearchListItem]').should('have.length.greaterThan', 0);
  });
});
