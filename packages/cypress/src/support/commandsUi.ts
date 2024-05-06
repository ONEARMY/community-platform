export enum UserMenuItem {
  Profile = 'Profile',
  Settings = 'Settings',
  LogOut = 'Logout',
}

declare global {
  namespace Cypress {
    interface Chainable {
      toggleUserMenuOn(): Chainable<void>
      toggleUserMenuOff(): Chainable<void>

      /**
       * Trigger form validation
       */
      screenClick(): Chainable<void>

      clickMenuItem(menuItem: UserMenuItem): Chainable<void>

      /**
       * Selecting options from the react-select picker can be a bit fiddly
       * so user helper method to locate select box, type input and pick tag
       * (if exists) https://github.com/cypress-io/cypress/issues/549
       * @param tagname This will be typed into the input box and selected from the dropdown list
       * @param selector Specify the selector of the react-select element
       **/
      selectTag(tagName: string, selector?: string): Chainable<void>
    }
  }
}

/**
 * Create custom commands that can be used within cypress chaining and namespace
 * @remark - any called functions should be 'wrapped' in a cy.wrap('some name') statement to allow chaining
 * @remark - async code should be wrapped in a Cypress.promise block to allow the resolved promise to be
 * used in chained results
 */

Cypress.Commands.add('toggleUserMenuOn', () => {
  Cypress.log({ displayName: 'OPEN_USER_MENU' })
  cy.get('[data-cy=user-menu]').should('be.exist')
  cy.get('[data-cy=user-menu]').click()
})

Cypress.Commands.add('toggleUserMenuOff', () => {
  Cypress.log({ displayName: 'CLOSE_USER_MENU' })
  cy.get('[data-cy=header]').click({ force: true })
})

Cypress.Commands.add('clickMenuItem', (menuItem: UserMenuItem) => {
  Cypress.log({
    displayName: 'CLICK_MENU_ITEM',
    consoleProps: () => {
      return { menuItem }
    },
  })
  cy.toggleUserMenuOn()
  cy.get(`[data-cy=menu-${menuItem}]`).click()
})

Cypress.Commands.add('screenClick', () => {
  cy.get('[data-cy=header]').click({ force: true })
})

Cypress.Commands.add(
  'selectTag',
  (tagName: string, selector = '[data-cy=tag-select]') => {
    cy.log('select tag', tagName)
    cy.get(`${selector} input`)
      .click({ force: true })
      .type(tagName, { force: true })
      .get(`${selector} .data-cy__menu-list`)
      .contains(tagName)
      .click()
  },
)
