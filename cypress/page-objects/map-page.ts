/// <reference types="Cypress" />

export class MapPage {
  navigate() {
    cy.visit('/map')
  }

  searchCity() {
    cy.get('#mapPage').within(() => {
      cy.get('input:first')
        .should('have.attr', 'placeholder', 'Search for a location')
        .type('Rio De Janeiro')
    })
  }
}
