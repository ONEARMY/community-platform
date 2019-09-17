/// <reference types="Cypress" />

export class SignUpPage {
  navigate() {
    cy.visit('https://dev.onearmy.world/sign-up')
  }
}
