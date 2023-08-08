context('map', () => {
  beforeEach(() => {
    cy.visit('/map')
  })
  it('should render an `accepted` pin', () => {
    cy.get('[class*="leaflet-marker-icon"]').should('exist')
  })
})
