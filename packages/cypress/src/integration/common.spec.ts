import { UserMenuItem } from '../support/commands'

describe('[Common]', () => {
  describe('[User Menu]', () => {
    it('[By Anonymous]', () => {
      cy.step('Login and Join buttons are available')
      cy.visit('/how-to')
      cy.get('[data-cy=login]').should('be.visible')
      cy.get('[data-cy=join]').should('be.visible')
      cy.get('[data-cy=user-menu]').should('not.exist')
    })

    it('[By Authenticated]', () => {
      const username = 'howto_reader'
      cy.visit('/how-to')
      cy.step('Login and Join buttons are unavailable to logged-in users')
      cy.login(`${username}@test.com`, 'test1234')
      cy.get('[data-cy=login]', { timeout: 20000 }).should('not.exist')
      cy.get('[data-cy=join]').should('not.exist')

      cy.step('User Menu is toggle')
      cy.toggleUserMenuOn()
      cy.get('[data-cy=user-menu-list]').should('be.visible')
      cy.toggleUserMenuOff()
      cy.get('[data-cy=user-menu-list]').should('not.exist')

      cy.step('Go to Profile')
      cy.clickMenuItem(UserMenuItem.Profile)
      cy.url().should('include', `/u/${username}`)

      cy.step('Go to Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      cy.url().should('include', 'settings')

      cy.step('Logout the session')
      cy.clickMenuItem(UserMenuItem.LogOut)
      cy.get('[data-cy=login]').should('be.visible')
      cy.get('[data-cy=join]').should('be.visible')
    })
  })
})
