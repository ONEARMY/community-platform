/// <reference types="Cypress" />

export class HowToPage {
  navigate() {
    cy.visit('/how-to')
    cy.contains('Learn & share how to recycle, make and hack plastic')
  }
}
