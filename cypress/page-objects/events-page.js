/// <reference types="Cypress" />

export class EventsPage {
  navigate() {
    cy.visit('https://dev.onearmy.world/events')
    cy.contains('Precious Plastic events from around the world')
  }
}
