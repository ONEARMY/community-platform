import { HowToPage } from './how-to-page'
import { SingUpSuccessPage } from './sign-up-success-page'

export class SignUpPage {
  constructor() {
    cy.contains('Hey, nice to see you here')
  }

  createUser() {
    var userName = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 10)
    cy.get('input[name="userName"]').type(userName)
    cy.get('input[name="email"]').type(`${userName}@test.com`)
    cy.get('input[name="password"]').type('12345678')
    cy.get('input[name="confirm-password"]').type('12345678')

    cy.get('button[type="submit"]').click()
    return new SingUpSuccessPage()
  }
}
