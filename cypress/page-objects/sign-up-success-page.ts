import { HowToPage } from './how-to-page'

export class SingUpSuccessPage {
  constructor() {
    cy.url().should('include', 'sign-up-message')
    cy.contains('Sent')
    cy.contains('Sign up successful')
    cy.contains(
      'We sent you an email with all the details to complete your profile.',
    )
  }

  goHome() {
    cy.contains('Home').click()
    return new HowToPage()
  }
}
