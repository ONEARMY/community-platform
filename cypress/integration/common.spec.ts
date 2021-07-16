import { UserMenuItem } from '../support/commands'

describe('[Common]', () => {
  it('[Default Page]', () => {
    cy.step('The home page is /academy')
    cy.visit('/')
      .url()
      .should('include', '/academy')
  })

  it('[Not-Found Page]', () => {
    const unknownUrl = '/abcdefghijklm'
    cy.visit(unknownUrl)
    cy.contains('404').should('be.exist')
    cy.contains(
      `The page you were looking for was moved or doesn't exist`,
    ).should('be.exist')
    cy.get('a')
      .contains('Home')
      .should('have.attr', 'href')
      .and('eq', '/')
  })

  it('[Page Navigation]', () => {
    cy.visit('/how-to')
    // cy.step('Feedback button opens the survey in a new tab')
    // cy.get('a[data-cy=feedback][target=_blank]')
    //   .should('have.attr', 'href')
    //   .and(
    //     'eq',
    //     'https://docs.google.com/forms/d/e/1FAIpQLSd3nevXb6iewap1lkFPWQxyerLsndcRkocv4QXIL3iLIyzazA/viewform?usp=pp_url&entry.1856170488=',
    //   )

    cy.step('Go to Events page')
    cy.get('[data-cy=page-link]')
      .contains('Events')
      .click()
    cy.url().should('include', '/events')
    // cy.get('[data-cy=feedback] > button').should('be.visible')

    cy.step('Go to Map page')
    cy.get('[data-cy=page-link]')
      .contains('Map')
      .click()
    cy.url().should('include', '/map')
    // cy.get('[data-cy=feedback] > button').should('be.visible')

    cy.step('Go to Academy page')
    cy.get('[data-cy=page-link]')
      .contains('Academy')
      .click()
    cy.url().should('include', '/academy')
    // cy.get('[data-cy=feedback] > button').should('be.visible')

    cy.step('Go to How-to page')
    cy.get('[data-cy=page-link]')
      .contains('How-to')
      .click()
    cy.url().should('include', '/how-to')
    // cy.get('[data-cy=feedback] > button').should('be.visible')
  })

  describe('[User Menu]', () => {
    it('[By Anonymous]', () => {
      cy.step('Login and Join buttons are available')
      cy.logout()
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
