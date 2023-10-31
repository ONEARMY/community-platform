context('map', () => {
  describe('member pins', () => {
    it('by default should render all `accepted` pins', () => {
      localStorage.setItem('platformTheme', 'project-kamp')
      cy.visit('/map')

      cy.get('[class*="leaflet-marker-icon"]').should('exist')
      cy.get('[class*="icon-member"]').should('exist')
    })

    it('for PP is should render all non-member `accepted` pins', () => {
      localStorage.setItem('platformTheme', 'precious-plastic')
      cy.visit('/map')

      cy.get('[class*="leaflet-marker-icon"]').should('exist')
      cy.get('[class*="icon-member"]').should('not.exist')
    })
  })
})
