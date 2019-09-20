/// <reference types="Cypress" />

export class SignInPage {
  navigate() {
    cy.visit('/sign-in')
  }
}
