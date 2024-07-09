import { form } from '../../../../src/pages/UserSettings/labels'
import { generateNewUserDetails } from '../utils/TestUtils'

import type { IUser } from '../../../../src/models/user.models'

export enum UserMenuItem {
  Profile = 'Profile',
  Settings = 'Settings',
  LogOut = 'Logout',
}

interface IInfo {
  username: string
  country?: string
  description: string
  coverImage: string
}

type ILink = Omit<IUser['links'][0] & { index: number }, 'key'>

interface IMapPin {
  description: string
  searchKeyword: string
  locationName: string
}

interface IOpeningTime {
  index: number
  day: string
  from: string
  to: string
}

declare global {
  namespace Cypress {
    interface Chainable {
      fillSignupForm(
        username: string,
        email: string,
        password: string,
      ): Chainable<void>

      saveSettingsForm()
      setSettingAddContactLink(link: ILink)
      setSettingAddOpeningTime(openingTime: IOpeningTime)
      setSettingBasicUserInfo(info: IInfo)
      setSettingDeleteOpeningTime(index: number, confirmed: boolean)
      setSettingFocus(focus: string)
      setSettingImpactData()
      setSettingMapPinMember(pin: IMapPin)
      setSettingMapPinWorkspace(pin: IMapPin)
      setSettingPublicContact()

      signUpNewUser(user?)

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

Cypress.Commands.add('saveSettingsForm', () => {
  cy.get('[data-cy=save]').click()
  cy.get('[data-cy=errors-container]').should('not.exist')
  cy.get('[data-cy=save]').should('not.be.disabled')
})

Cypress.Commands.add('setSettingAddContactLink', (link: ILink) => {
  cy.step('Set Contact Link')

  if (link.index > 0) {
    // click the button to add another set of input fields
    cy.get('[data-cy=add-link]').click()
  }
  // specifies the contact type, such as website or discord
  cy.selectTag(link.label, `[data-cy=select-link-${link.index}]`)
  // input the corresponding value
  cy.get(`[data-cy=input-link-${link.index}]`)
    .clear()
    .type(link.url)
    .blur({ force: true })
})

Cypress.Commands.add(
  'setSettingAddOpeningTime',
  (openingTime: IOpeningTime) => {
    const selectOption = (selector: string, selectedValue: string) => {
      cy.selectTag(selectedValue, selector)
    }

    if (openingTime.index > 0) {
      cy.get('[data-cy=add-opening-time]').click()
    }
    selectOption(
      `[data-cy=opening-time-day-${openingTime.index}]`,
      openingTime.day,
    )
    selectOption(
      `[data-cy=opening-time-from-${openingTime.index}]`,
      openingTime.from,
    )
    selectOption(
      `[data-cy=opening-time-to-${openingTime.index}]`,
      openingTime.to,
    )
  },
)

Cypress.Commands.add('setSettingBasicUserInfo', (info: IInfo) => {
  cy.step('Update Info section')
  cy.get('[data-cy=username]').clear().type(info.username)
  cy.get('[data-cy=info-description]').clear().type(info.description)
  cy.get('[data-cy=coverImages-0]').find(':file').attachFile(info.coverImage)
})

Cypress.Commands.add(
  'setSettingDeleteOpeningTime',
  (index: number, confirmed: boolean) => {
    cy.viewport('macbook-13')
    cy.get(`[data-cy=delete-opening-time-${index}-desk]`).click()
    if (confirmed) {
      cy.get('[data-cy=confirm-delete]').click()
    } else {
      cy.get('[data-cy=cancel-delete]').click()
    }
  },
)

Cypress.Commands.add('setSettingFocus', (focus: string) => {
  cy.get(`[data-cy=${focus}]`).click()
})

Cypress.Commands.add('setSettingMapPinWorkspace', (mapPin: IMapPin) => {
  cy.setSettingMapPinMember(mapPin)
  cy.get('[data-cy="osm-geocoding-input"]').should(($input) => {
    const val = $input.val()
    expect(val).to.include(mapPin.locationName)
  })
})

Cypress.Commands.add('setSettingImpactData', () => {
  cy.step('Save impact data')

  cy.get('[data-cy="impact-button-expand"]').click()
  cy.get('[data-cy="impactForm-2022-button-edit"]').click()
  cy.get('[data-cy="impactForm-2022-field-revenue-value"]')
    .clear()
    .type('100000')
  cy.get('[data-cy="impactForm-2022-field-revenue-isVisible"]').click()
  cy.get('[data-cy="impactForm-2022-field-machines-value"]').clear()
  cy.get('[data-cy="impactForm-2022-button-save"]').click()
  cy.contains(form.saveSuccess)
})

Cypress.Commands.add('setSettingMapPinMember', (mapPin: IMapPin) => {
  cy.step('Add pin')
  cy.get('[data-cy=add-a-map-pin]').click({ force: true })
  cy.get('[data-cy="osm-geocoding-input"]').clear().type(mapPin.searchKeyword)
  cy.get('[data-cy="osm-geocoding-results"]')
  cy.wait('@fetchAddress').then(() => {
    cy.get('[data-cy="osm-geocoding-results"]').find('li:eq(0)').click()
  })
  cy.get('[data-cy=pin-description]').clear().type(mapPin.description)
})

Cypress.Commands.add('setSettingPublicContact', () => {
  cy.step('Opts out of public contact')
  cy.get('[data-cy=isContactableByPublic]').should('be.checked')
  cy.get('[data-cy=isContactableByPublic]').click({ force: true })
})

Cypress.Commands.add(
  'fillSignupForm',
  (username: string, email: string, password: string) => {
    cy.log('Fill in sign-up form')
    cy.visit('/sign-up')
    cy.get('[data-cy=username]').clear().type(username)
    cy.get('[data-cy=email]').clear().type(email)
    cy.get('[data-cy=password]').clear().type(password)
    cy.get('[data-cy=confirm-password]').clear().type(password)
    cy.get('[data-cy=consent]').check()
  },
)

Cypress.Commands.add('signUpNewUser', (user?) => {
  cy.log('Generate new user details')
  const { username, email, password } = user || generateNewUserDetails()

  cy.fillSignupForm(username, email, password)
  cy.get('[data-cy=submit]').click()
  cy.url().should('include', 'sign-up-message')
})

Cypress.Commands.add('toggleUserMenuOn', () => {
  Cypress.log({ displayName: 'OPEN_USER_MENU' })
  cy.get('[data-cy=user-menu]').should('be.visible')
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
