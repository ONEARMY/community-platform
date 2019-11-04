import { DbCollectionName, Page } from '../../utils/test-utils'
import { UserMenuItem } from '../../support/commands'

describe('[Settings]', () => {
  describe('[Focus Workplace]', () => {
    const freshSettings = {
      _authID: 'l9N5HFHzSjQvtP9g9MyFnPpkFmM2',
      _id: 'settings_workplace_new',
      userName: 'settings_workplace_new',
      _deleted: false,
      _created: '2018-01-24T14:46:42.038Z',
      _modified: '2018-01-24T14:46:42.038Z',
      verified: true,
    }

    const expected = {
      _authID: 'l9N5HFHzSjQvtP9g9MyFnPpkFmM2',
      _deleted: false,
      _id: 'settings_workplace_new',
      about: 'We have some space to run a workplace',
      country: 'United States',
      coverImages: [
        {
          contentType: 'image/jeg',
          fullPath:
            'uploads/v2_users/settings_workplace_new/images/profile-cover-1.jpg',
          name: 'profile-cover-1.jpg',
          size: 18987,
          type: 'image/jpeg',
        },
        {
          contentType: 'image/jpeg',
          fullPath:
            'uploads/v2_users/settings_workplace_new/images/profile-cover-2.jpg',
          name: 'profile-cover-2.jpg',
          size: 20619,
          type: 'image/jpeg',
        },
      ],
      links: [
        {
          label: 'email',
          url: 'settings_workplace_new@test.com',
        },
        {
          label: 'website',
          url: 'www.settings_workplace_new.com',
        },
      ],
      location: {
        administrative: 'Ohio',
        country: 'United States of America',
        countryCode: 'us',
        latlng: {
          lat: 39.9623,
          lng: -83.0007,
        },
        name: 'Columbus',
        postcode: '43085',
        value: 'Columbus, Ohio, United States of America',
      },
      mapPinDescription: "Come in & let's make cool stuff out of plastic!",
      openingHours: [
        {
          day: '',
          openFrom: '',
          openTo: '',
        },
      ],
      profileType: 'workspace',
      userName: 'settings_workplace_new',
      verified: true,
      workspaceType: 'shredder',
    }

    it('[Editing a new Profile]', () => {
      cy.logout()
      cy.updateDocument(
        DbCollectionName.v2_users,
        freshSettings.userName,
        freshSettings,
      )
      cy.visit('/')
      cy.login('settings_workplace_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      cy.get(`[data-cy=${expected.profileType}]`).click()
      cy.get(`[data-cy=${expected.workspaceType}]`).click()

      cy.step('Update Info section')
      cy.get('[data-cy=username').clear().type(freshSettings.userName)
      cy.get('[data-cy=country]').find('.flag-select').click()
      cy.get('[data-cy=country]').find(':text').type('United')
      cy.get('[data-cy=country]').contains(expected.country).click()
      cy.get('[data-cy=info-description').clear().type(expected.about)
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
      cy.get('[data-cy=pin-description]').type(expected.mapPinDescription)
      cy.get('[data-cy=location]').find(':text').type('ohio')
      cy.get('[data-cy=location]').contains('Columbus').click()

      cy.get('[data-cy=save]').click().wait(6000)

      cy.step('Verify if all changes were saved correctly')
      cy.queryDocuments(DbCollectionName.v2_users, 'userName', '==', expected.userName).should('eqSettings', expected)
    })

  })
})
