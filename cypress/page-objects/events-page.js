/// <reference types="Cypress" />

export class EventsPage {
  navigate() {
    cy.visit('/events')
    cy.contains('Precious Plastic events from around the world')
  }
}
