import { DbCollectionName, Page } from '../../utils/test-utils'
import { UserMenuItem } from '../../support/commands'

describe('[Settings]', () => {
  const freshSettings = {
    _authID: 'l9N5HFHzSjQvtP9g9MyFnPpkFmM2',
    _id: 'settings_workplace_new',
    userName: 'settings_workplace_new',
    _deleted: false,
    _created: '2018-01-24T14:46:42.038Z',
    _modified: '2018-01-24T14:46:42.038Z',
    verified: true,
  }

  describe('[Focus Workplace]', () => {
    it('[Editing a new Profile]', () => {
      cy.updateDocument(
        DbCollectionName.v2_users,
        freshSettings.userName,
        freshSettings,
      )
      cy.visit(Page.EVENTS)
      cy.login('settings_workplace_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      cy.get('[data-cy=workspace]').click()
      cy.get('[data-cy=shredder]').click()

      cy.step('Update Info section')
      cy.get('[data-cy=username').clear().type(freshSettings.userName)
      cy.get('[data-cy=country]').find('.flag-select').click()
      cy.get('[data-cy=country]').find(':text').type('United')
      cy.get('[data-cy=country]').contains('United States').click()
      cy.get('[data-cy=info-description').clear().type('We have some space to run a workplace')
      cy.get('[data-cy=cover-images]').get(':file').uploadFiles([
        'images/profile-cover-1.jpg',
        'images/profile-cover-2.jpg',
      ])

      cy.step('Update Contact Links')
      cy.get('[data-cy=select-link-0]').click()
      cy.get('[data-cy=select-link-0]').contains('email').click()
      cy.get('[data-cy=input-link-0]').type(`${freshSettings.userName}@test.com`)
      cy.get('[data-cy=add-link]').click()
      cy.get('[data-cy=select-link-1]').click()
      cy.get('[data-cy=select-link-1]').contains('website').click()
      cy.get('[data-cy=input-link-1]').type(`www.${freshSettings.userName}.com`)

      cy.step('Update Map section')
      cy.get('[data-cy=pin-description]').type(`Come in & let's make cool stuff out of plastic!`)
      cy.get('[data-cy=location]').find(':text').type('ohio')
      cy.get('[data-cy=location]').contains('Columbus').click()

      cy.get('[data-cy=save]').click()
    })
  })
})
