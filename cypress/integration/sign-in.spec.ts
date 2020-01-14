import { Page } from '../utils/test-utils'

describe('[Sign in]', () => {
  it('[By Anonymous]', () => {
    cy.step('Go to the sign-up page')
    cy.visit('/sign-in')
    cy.get('a[data-cy=no-account]')
      .click()
      .url()
      .should('include', '/sign-up')
    cy.get('div')
      .contains('Create an account')
      .should('be.exist')

    cy.step('Lost Password requires email')
    cy.visit('/sign-in')
    cy.get('[data-cy=lost-password]').click()
    cy.get('[data-cy=notification-error]').should('be.visible')

    cy.step('Lost Password cannot sent a reset link on wrong email')
    cy.get('[data-cy=email]')
      .clear()
      .type('what_is_mypassword@test.com')
    cy.get('[data-cy=lost-password]').click()
    cy.get('[data-cy=notification-error]').should('be.visible')

    cy.step('Login with correct credentials')
    cy.get('[data-cy=email]')
      .clear()
      .type('howto_reader@test.com')
    cy.get('[data-cy=password]')
      .clear()
      .type('test1234')
    cy.get('[data-cy=login-form]').submit()
    cy.get('[data-cy=user-menu]')
  })
})
