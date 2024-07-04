import { SingaporeStubResponse } from '../fixtures/searchResults'
import { UserMenuItem } from '../support/commandsUi'

describe('[Notification Banner]', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('[By unregistered user]', () => {
    it('[Notification Banner is not visible]', () => {
      cy.get('[data-cy=notificationBanner]').should('not.exist')
    })
  })

  describe('[By Authenticated]', () => {
    it('[Banners visible for user with blank profile]', () => {
      cy.interceptAddressSearchFetch(SingaporeStubResponse)

      cy.signUpNewUser()
      cy.get('[data-cy=emailNotVerifiedBanner]').should('be.visible')
      cy.get('[data-cy=incompleteProfileBanner]').click()

      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)

      cy.step('Update Member section')
      cy.get('[data-cy="add-a-map-pin"]').click({ force: true })
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
      cy.selectTag('email', `[data-cy=select-link-0]`)
      cy.get(`[data-cy=input-link-0]`).clear().type('test@test.com')
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy="TextNotification: success"]')

      cy.step('Banner no longer visible')
      cy.visit('/')
      cy.get('[data-cy=incompleteProfileBanner]').should('not.exist')
      cy.get('[data-cy=emailNotVerifiedBanner]').should('be.visible')
    })
  })
})
