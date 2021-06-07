import { generatedId } from '../utils/test-utils'
import { FRIENDLY_MESSAGES } from 'oa-shared'

// existing user already created in auth system
const authUser = {
  username: 'howto_reader',
  email: 'howto_reader@test.com',
  password: 'test1234',
  confirmPassword: 'test1234',
}
const newUser = {
  username: `CI_${generatedId(5)}`,
  email: `CI_${generatedId(5)}@test.com`,
  password: 'test1234',
  confirmPassword: 'test1234',
}

beforeEach(() => {
  cy.visit('/sign-up')
})

const fillSignupForm = (form: typeof authUser) => {
  const { username, email, password, confirmPassword } = form
  cy.get('[data-cy=username]')
    .clear()
    .type(username)
  cy.get('[data-cy=email]')
    .clear()
    .type(email)
  cy.get('[data-cy=password]')
    .clear()
    .type(password)
  cy.get('[data-cy=confirm-password]')
    .clear()
    .type(confirmPassword)
  cy.get('[data-cy=consent]').check()
}

describe('[Sign-up - existing user]', () => {
  it('prevent duplicate name', () => {
    fillSignupForm(authUser)
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=error-msg]')
      .contains(FRIENDLY_MESSAGES['sign-up username taken'])
      .should('be.exist')
  })
  it('prevent duplicate email', () => {
    const user = { ...authUser, username: `new_username_${generatedId(5)}` }
    fillSignupForm(user)
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=error-msg]')
      .contains('The email address is already in use')
      .should('be.exist')
  })
})
describe('[Sign-up - new user]', () => {
  it('create new account', () => {
    fillSignupForm(newUser)
    cy.get('[data-cy=submit]').click()
    cy.url().should('include', 'sign-up-message')
    cy.get('div')
      .contains('Sign up successful')
      .should('be.visible')
  })
  it('sign in as new user', () => {
    cy.visit('/')
    cy.logout()
    cy.wait(1000)
    cy.get('[data-cy=login]').click()
    cy.get('[data-cy=email]').type(newUser.email)
    cy.get('[data-cy=password]').type(newUser.password)
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=user-menu]')
  })

  after(() => {
    cy.log('clearing user from auth')
    cy.deleteCurrentUser()
  })
})
