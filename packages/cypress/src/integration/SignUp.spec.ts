import { FRIENDLY_MESSAGES } from 'oa-shared'

import { generateNewUserDetails } from '../utils/TestUtils'

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
      cy.contains(FRIENDLY_MESSAGES['sign-up/username-short']).should(
        'be.visible',
      )

      cy.step('Email is invalid')
      cy.get('[data-cy=email]').click()
      cy.get('[data-cy=email]').clear().type('a')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains(FRIENDLY_MESSAGES['auth/invalid-email']).should('be.visible')

      cy.step('Password is too short')
      cy.get('[data-cy=password]').click()
      cy.get('[data-cy=password]').clear().type('a')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains(FRIENDLY_MESSAGES['sign-up/password-short']).should(
        'be.visible',
      )

      cy.step('Password confirmation does not match')
      cy.get('[data-cy=password]').click()
      cy.get('[data-cy=password]').clear().type('a')
      cy.get('[data-cy=confirm-password]').click()
      cy.get('[data-cy=confirm-password]').clear().type('b')
      cy.get('[data-cy=consent]').uncheck().check()
      cy.contains(FRIENDLY_MESSAGES['sign-up/password-mismatch']).should(
        'be.visible',
      )
    })
  })

  describe('[Cannot duplicate existing user]', () => {
    it('Prevents duplicate name', () => {
      const user = generateNewUserDetails()
      const { email, username, password } = user

      cy.signUpNewUser(user)
      cy.logout()
      cy.fillSignupForm(username, email, password)
      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy="TextNotification: failure"]')
        .contains(FRIENDLY_MESSAGES['sign-up/username-taken'])
        .should('be.visible')
    })

    it('Prevents duplicate email', () => {
      const user = generateNewUserDetails()
      const { email, username, password } = user

      cy.signUpNewUser(user)
      cy.logout()
      cy.fillSignupForm(`${username}-new`, email, password)
      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy="TextNotification: failure"]')
        .contains(FRIENDLY_MESSAGES['generic-error'])
        .should('be.visible')
    })
  })

  describe('[Update existing auth details]', () => {
    it('Updates username and password', () => {
      const user = generateNewUserDetails()
      const { email, username, password } = user
      cy.signUpNewUser(user)

      const newEmail = `${username}-super_cool@test.com`
      const newPassword = '<dfbss73DF'

      cy.step('Go to settings page')
      cy.visit('/settings')

      // cy.get('[data-cy="loader"]').not('visible')
      cy.get('[data-cy="tab-Account"]').click()

      cy.step('Update Email')
      cy.get('[data-cy="accordionContainer"]').click({ multiple: true })
      cy.get('[data-cy="changeEmailContainer"]')
        .contains(`Current email address: ${email}`)
        .should('be.visible')
      cy.get('[data-cy="newEmail"]').clear().type(newEmail)
      cy.get('[data-cy="password"]').clear().type(password)
      cy.get('[data-cy="changeEmailSubmit"]').click()
      cy.get('[data-cy="changeEmailContainer"')
        .contains(FRIENDLY_MESSAGES['auth/email-changed'])
        .should('be.visible')

      cy.step('Update Password')
      cy.get('[data-cy="accordionContainer"]').click({ multiple: true })
      cy.get('[data-cy="oldPassword"]').clear().type(password)
      cy.get('[data-cy="newPassword"]').clear().type(newPassword)
      cy.get('[data-cy="repeatNewPassword"]').clear().type(newPassword)
      cy.get('[data-cy="changePasswordSubmit"]').click()
      cy.get('[data-cy="changePasswordContainer"')
        .contains(FRIENDLY_MESSAGES['auth/password-changed'])
        .should('be.visible')
    })
  })
})
