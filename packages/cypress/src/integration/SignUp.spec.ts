import { FRIENDLY_MESSAGES } from 'oa-shared'

describe('[User sign-up]', () => {
  beforeEach(() => {
    cy.visit('/sign-up')
  })

  describe('[New user]', () => {
    it('Validate sign-up form', () => {
      cy.step('Username is too short')
      cy.get('[data-cy=username]').click()
      cy.get('[data-cy=username]').clear().type('a')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains('Username must be at least 2 characters').should('be.visible')

      cy.step('Email is invalid')
      cy.get('[data-cy=email]').click()
      cy.get('[data-cy=email]').clear().type('a')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains(FRIENDLY_MESSAGES['auth/invalid-email']).should('be.visible')

      cy.step('Password is too short')
      cy.get('[data-cy=password]').click()
      cy.get('[data-cy=password]').clear().type('a')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains('Password must be at least 6 characters').should('be.visible')

      cy.step('Password confirmation does not match')
      cy.get('[data-cy=password]').click()
      cy.get('[data-cy=password]').clear().type('a')
      cy.get('[data-cy=confirm-password]').click()
      cy.get('[data-cy=confirm-password]').clear().type('b')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains('Your new password does not match').should('be.visible')
    })
  })
})
