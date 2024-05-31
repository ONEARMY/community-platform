import { UserMenuItem } from '../support/commandsUi'

describe('[Common]', () => {
  it('[Default Page]', () => {
    cy.step('The home page is /academy')
    cy.visit('/').url().should('include', '/academy')
  })

  it('[Not-Found Page]', () => {
    const unknownUrl = '/abcdefghijklm'
    cy.visit(unknownUrl)
    cy.get('[data-test="NotFound: Heading"]')
      .contains(`Nada, page not found 💩`)
      .should('be.exist')
    cy.get('a').contains('home page').should('have.attr', 'href').and('eq', '/')
  })

  it('[Page Navigation]', () => {
    cy.visit('/how-to')

    cy.step('Go to Map page')
    cy.get('[data-cy=page-link]').contains('Map').click()
    cy.url().should('include', '/map')

    cy.step('Go to Academy page')
    cy.get('[data-cy=page-link]').contains('Academy').click()
    cy.url().should('include', '/academy')

    cy.step('Go to How-to page')
    cy.get('[data-cy=page-link]').contains('How-to').click()
    cy.url().should('include', '/how-to')
  })

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
      cy.get('[data-cy=login]', { timeout: 20000 }).should('be.visible')
      cy.get('[data-cy=join]').should('be.visible')
    })
  })
})
