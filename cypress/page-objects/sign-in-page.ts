import { HowToPage } from '../page-objects/how-to-page'

export class SignInPage {
  constructor() {
    cy.contains('Welcome back homie')
    cy.contains('Log in to your account')
  }

  login() {
    cy.get('input[name="email"]').type('howto_reader@test.com')
    cy.get('input[name="password"]').type('test1234')
    cy.get('button[type="submit"]').click()
    return new HowToPage()
  }
}
