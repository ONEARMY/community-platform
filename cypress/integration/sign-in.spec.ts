import { Page } from '../utils/test-utils'

describe('[Sign in]', () => {
  it('[By Anonymous]', () => {
    cy.logout()
    cy.step('Go to the sign-up page')
    cy.visit('/sign-in')
    cy.get('a[data-cy=no-account]')
      .click()
      .url()
      .should('include', '/sign-up')
    cy.get('div')
      .contains('Create an account')
      .should('be.exist')
    cy.step('Login with correct credentials')
    cy.get('[data-cy=sign-in-button]').click()
    cy.get('[data-cy=email]').type('howto_reader@test.com')
    cy.get('[data-cy=password]').type('test1234')
    cy.get('[data-cy=submit]')
      .click()
      .url()
      .should('include', Page.HOME_PAGE)
  })
})
