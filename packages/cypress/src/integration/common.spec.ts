import { UserMenuItem } from '../support/commandsUi'
import { generateNewUserDetails } from '../utils/TestUtils'

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
      .should('be.visible')
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

  describe.only('[User feeback button]', () => {
    it('[Desktop]', () => {
      cy.visit('/how-to')
      cy.get('[data-cy=feedback]').should('contain', 'Report a Problem')
      cy.get('[data-cy=feedback]')
        .should('have.attr', 'href')
        .and('contain', '/how-to?sort=Newest')

      cy.visit('/map')
      cy.get('[data-cy=feedback]')
        .should('have.attr', 'href')
        .and('contain', '/map')
    })

    it('[Mobile]', () => {
      cy.viewport('iphone-6')

      cy.visit('/how-to')
      cy.get('[data-cy=feedback]').should('contain', 'Problem?')
      cy.get('[data-cy=feedback]')
        .should('have.attr', 'href')
        .and('contain', '/how-to?sort=Newest')

      cy.visit('/map')
      cy.get('[data-cy=feedback]')
        .should('have.attr', 'href')
        .and('contain', '/map')
    })
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
      cy.visit('/how-to')

      cy.step('Login and Join buttons are unavailable to logged-in users')
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)
      cy.get('[data-cy=login]', { timeout: 20000 }).should('not.exist')
      cy.get('[data-cy=join]').should('not.exist')

      cy.step('User Menu is toggle')
      cy.toggleUserMenuOn()
      cy.get('[data-cy=user-menu-list]').should('be.visible')
      cy.toggleUserMenuOff()
      cy.get('[data-cy=user-menu-list]').should('not.exist')

      cy.step('Go to Profile')
      cy.clickMenuItem(UserMenuItem.Profile)
      cy.url().should('include', `/u/${user.username}`)

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
