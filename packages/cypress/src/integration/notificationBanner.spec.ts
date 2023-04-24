import { UserMenuItem } from '../support/commands'
import { SingaporeStubResponse } from '../fixtures/searchResults'

describe('[Notification Banner]', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('[By unregistered user]', () => {
    it('[Notification Banner is visible for user with blank profile]', () => {
      cy.get('[data-cy=notificationBanner]').should('not.exist')
    })
  })

  describe('[By Authenticated user with blank profile]', () => {
    it('[Notification Banner is visible for user with blank profile]', () => {
      cy.login('howto_reader@test.com', 'test1234')
      cy.get('[data-cy=notificationBanner]').click()
      cy.url().should('eq', 'http://localhost:3456/settings')
    })
  })

  describe('[By Authenticated user with filled profile]', () => {
    it('[Notification Banner is visible for user with blank profile]', () => {
      cy.interceptAddressFetch(SingaporeStubResponse)

      cy.login('howto_reader@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)

      //fill in profile
      cy.get('[data-cy="add-a-map-pin"]').click()
      cy.step('Update Member section')
      cy.get('[data-cy=pin-description]').clear().type('test')
      cy.get('[data-cy="osm-geocoding-input"]').clear().type('singapo')
      cy.get('[data-cy="osm-geocoding-results"]')
      cy.wait('@fetchAddress').then(() => {
        cy.get('[data-cy="osm-geocoding-results"]').find('li:eq(0)').click()
      })

      cy.step('Update Info section')
      cy.get('[data-cy=username').clear().type('tester')
      cy.get('[data-cy=info-description').clear().type('tester info')
      cy.get('[data-cy=coverImages-0]')
        .find(':file')
        .attachFile('images/profile-cover-1.jpg')

      cy.step('Update Contact Links')
      cy.selectTag('email', `[data-cy=select-link-0]`)
      cy.get(`[data-cy=input-link-0]`).clear().type('test@test.com')
      cy.get('[data-cy=save]').click()
      cy.wait(3000)
      cy.get('[data-cy=notificationBanner]').should('not.exist')
    })
  })
})
