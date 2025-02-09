import { FRIENDLY_MESSAGES } from 'oa-shared'

import { MOCK_DATA } from '../data'

const user = MOCK_DATA.users.change_auth_details

describe('[User sign-up]', () => {
  beforeEach(() => {
    cy.visit('/sign-up')
  })

  describe('[New user]', () => {
    it('Validate sign-up form', () => {
      cy.step('Username is too short')
      cy.get('[data-cy=username]').clear().type('a')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains('Username must be at least 2 characters').should('be.visible')

      cy.step('Email is invalid')
      cy.get('[data-cy=email]').clear().type('a')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains(FRIENDLY_MESSAGES['auth/invalid-email']).should('be.visible')

      cy.step('Password is too short')
      cy.get('[data-cy=password]').clear().type('a')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains('Password must be at least 6 characters').should('be.visible')

      cy.step('Password confirmation does not match')
      cy.get('[data-cy=password]').clear().type('a')
      cy.get('[data-cy=confirm-password]').clear().type('b')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains('Your new password does not match').should('be.visible')
    })
  })

  describe('[Update existing auth details]', () => {
    it('Updates username and password', () => {
      cy.signIn(user.email, user.password)

      const newEmail = `${user.userName}-super_cool@test.com`
      const newPassword = '<dfbss73DF'

      cy.step('Go to settings page')
      cy.visit('/settings')

      // cy.get('[data-cy="loader"]').not('visible')
      cy.get('[data-cy="tab-Account"]').click()

      cy.step('Update Email')
      cy.get('[data-cy="accordionContainer"]').click({ multiple: true })
      cy.get('[data-cy="changeEmailContainer"]')
        .contains(`Current email address: ${user.email}`)
        .should('be.visible')
      cy.get('[data-cy="newEmail"]').clear().type(newEmail)
      cy.get('[data-cy="password"]').clear().type(user.password)
      cy.get('[data-cy="changeEmailSubmit"]').click()
      cy.get('[data-cy="changeEmailContainer"')
        .contains(`Email changed to ${newEmail}`)
        .should('be.visible')

      cy.step('Update Password')
      cy.get('[data-cy="accordionContainer"]').click({ multiple: true })
      cy.get('[data-cy="oldPassword"]').clear().type(user.password)
      cy.get('[data-cy="newPassword"]').clear().type(newPassword)
      cy.get('[data-cy="repeatNewPassword"]').clear().type(newPassword)
      cy.get('[data-cy="changePasswordSubmit"]').click()
      cy.get('[data-cy="changePasswordContainer"')
        .contains(`Password changed`)
        .should('be.visible')
    })
  })
})
