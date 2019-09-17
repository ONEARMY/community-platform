/// <reference types="Cypress" />

export class HowToPage {
  navigate() {
    cy.visit('https://dev.onearmy.world/how-to')
    cy.contains('Learn & share how to recycle, make and hack plastic')
  }
}
