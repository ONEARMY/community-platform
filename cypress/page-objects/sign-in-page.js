/// <reference types="Cypress" />

export class SignInPage {
  navigate() {
    cy.visit('https://dev.onearmy.world/sign-in')
  }
}
