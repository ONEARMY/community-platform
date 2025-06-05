describe('[Research - List Articles]', () => {
  const researchPageUrl = '/research'

  beforeEach(() => {
    cy.visit(researchPageUrl)
  })

  it('[By Everyone - Lists all research articles]', () => {
    cy.step('Verify page loads with research articles')
    cy.get('[data-cy=ResearchList]').should('be.visible')
    cy.get('[data-cy=ResearchListItem]').should('have.length.greaterThan', 0)
  })

  it('[Search Functionality - Filters articles]', () => {
    const searchTerm = 'test'

    cy.step('Type a keyword into the search bar')
    cy.get('[data-cy=research-search-box]').clear().type(searchTerm)

    cy.step('Verify filtered results are displayed')
    cy.get('[data-cy=ResearchListItem]').should('have.length.at.least', 1)
  })

  it('[Search Functionality - Sorts by Latest Updated]', () => {
    cy.visit(researchPageUrl + '?sort=LatestUpdated')
    cy.step('Verify sorted results are displayed')
    cy.get('[data-cy=ResearchListItem]').first().contains('A test research')
  })

  it('[Pagination - Displays additional articles]', () => {
    cy.step('Verify pagination is visible')
    let itemCount
    cy.get('[data-cy=ResearchListItem]').then((items) => {
      itemCount = items.length
    })
    cy.get('[data-cy=loadMoreButton]').should('be.visible')
    cy.get('[data-cy=loadMoreButton]').click()

    cy.step('Verify additional articles are loaded')
    cy.then(() => {
      cy.get('[data-cy=ResearchListItem]').should(
        'have.length.greaterThan',
        itemCount,
      )
    })
  })
})
