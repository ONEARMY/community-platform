import { Page, generatedId } from '../utils/test-utils'

describe('[Sign-up]', () => {
  const username = `signup_gen_${generatedId(5)}`
  const email = `${username}@test.com`
  const password = `test1234`

  it('[By Everyone]', () => {
    cy.visit('/sign-up')

    cy.step('Password & Confirm-Password are different')
    cy.get('[data-cy=username]')
      .clear()
      .type('howto_reader')
    cy.get('[data-cy=email]')
      .clear()
      .type('howto_reader@test.com')
    cy.get('[data-cy=password]')
      .clear()
      .type('anything')
    cy.get('[data-cy=confirm-password]')
      .clear()
      .type('clearly_different')
    cy.screenClick()
    cy.contains('Your new password does not match').should('be.exist')

    cy.step('Username taken')
    cy.get('[data-cy=password]')
      .clear()
      .type(password)
    cy.get('[data-cy=confirm-password]')
      .clear()
      .type(password)
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=error-msg]')
      .contains('That display name is already taken')
      .should('be.exist')

    cy.step('Email taken')
    cy.get('[data-cy=username]')
      .clear()
      .type(username)
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=error-msg]')
      .contains('The email address is already in use')
      .should('be.exist')

    cy.step('Successful registration')
    cy.get('[data-cy=email]')
      .clear()
      .type(email)
    cy.get('[data-cy=submit]').click()

    cy.url().should('include', 'sign-up-message')
    cy.get('div')
      .contains('Sign up successful')
      .should('be.visible')
    cy.step('Login with the new user')
    cy.visit('/')
    cy.logout()
    cy.wait(1000)
    cy.get('[data-cy=login]').click()
    cy.get('[data-cy=email]').type(email)
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=user-menu]')
  })

  after(() => {
    cy.log('clearing user from auth')
    cy.deleteCurrentUser()
  })
})
