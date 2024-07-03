import { ExternalLinkLabel } from 'oa-shared'

import { SingaporeStubResponse } from '../fixtures/searchResults'
import * as settingsData from '../fixtures/settings'
import { UserMenuItem } from '../support/commandsUi'
import {
  DbCollectionName,
  generateNewUserDetails,
  setIsPreciousPlastic,
} from '../utils/TestUtils'

const locationStub = {
  administrative: '',
  country: 'Singapore',
  countryCode: 'sg',
  latlng: { lng: '103.8194992', lat: '1.357107' },
  name: 'Drongo Trail, Bishan, Central, Singapore, 578774, Singapore',
  postcode: '578774',
  value: 'Singapore',
}

describe('[Settings]', () => {
  beforeEach(() => {
    cy.interceptAddressSearchFetch(SingaporeStubResponse)
    setIsPreciousPlastic()
    cy.visit('/sign-in')
  })

  describe('[Focus Member]', () => {
    const freshSettings = settingsData.freshSettingsMember
    const expected = settingsData.expectedMember

    it('[Cancel edit profile without confirmation dialog]', () => {
      cy.login('settings_member_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      cy.step('Click on How to')
      cy.on('window:confirm', () => {
        throw new Error('Confirm dialog should not be called.')
      })
      cy.get('[data-cy=page-link]').contains('How-to').click()
      cy.step('Confirm log should NOT appear')
    })

    it('[Cancel edit profile and get confirmation]', (done) => {
      cy.login('settings_member_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      cy.get('[data-cy=username').clear().type('Wrong user')
      cy.step('Click on How to')
      cy.get('[data-cy=page-link]').contains('How-to').click()
      cy.step('Confirm log should log')
      cy.on('window:confirm', (text) => {
        expect(text).to.eq(
          'You are leaving this page without saving. Do you want to continue ?',
        )
        done()
      })
    })

    it('[Edit a new profile]', () => {
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(expected.profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Can set the required fields')
      cy.setSettingBasicUserInfo({
        username: expected.userName,
        country: expected.country,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.EMAIL,
        url: `${freshSettings.userName}@test.com`,
      })

      cy.setSettingAddContactLink({
        index: 1,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url: 'https://social.network',
      })

      // Remove first item
      cy.get('[data-cy="delete-link-0"]').last().trigger('click')
      cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible')
      cy.get('[data-cy="Confirm.modal: Confirm"]').trigger('click')

      cy.saveSettingsForm()

      cy.setSettingMapPinMember({
        description: expected.mapPinDescription,
        searchKeyword: 'Singapo',
        locationName: expected.location.value,
      })

      cy.saveSettingsForm()

      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        user.username,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })

      cy.step('Can remove a pin')
      cy.get('[data-cy="remove-a-member-map-pin"]').click()
      cy.get('[data-cy=location-dropdown]').should('be.visible')
    })
  })

  describe('[Focus Workplace]', () => {
    const expected = settingsData.expectedWorkplace

    it.only('[Editing a new Profile]', () => {
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(expected.profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      cy.get('[data-cy=shredder').click()
      cy.setSettingBasicUserInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.EMAIL,
        url: `${user.username}@test.com`,
      })

      cy.setSettingImpactData()

      cy.saveSettingsForm()

      cy.step('Verify if all changes were saved correctly')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        user.username,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
    })
  })

  describe('[Focus Machine Builder]', () => {
    it('[Edit a new profile]', () => {
      const user = generateNewUserDetails()
      const coverImage = 'images/profile-cover-2.png'
      const description = "We're mechanics and our jobs are making machines"
      const machineBuilderXp = ['electronics', 'welding']
      const mapPinDescription = 'Informative workshop on machines every week'
      const profileType = 'machine-builder'

      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      cy.setSettingBasicUserInfo({
        username: user.username,
        description,
        coverImage,
      })

      cy.step('Choose Expertise')
      cy.get(`[data-cy=${machineBuilderXp[0]}]`).click()
      cy.get(`[data-cy=${machineBuilderXp[1]}]`).click()

      cy.setSettingMapPinWorkspace({
        description: mapPinDescription,
        searchKeyword: 'singapo',
        locationName: locationStub.value,
      })

      cy.setSettingPublicContact()
      cy.saveSettingsForm()

      cy.visit(`u/${user.username}`)
      cy.contains(user.username)
      cy.contains(description)
      // To-do: Finish adding the expectations of the settings set in this test
    })
  })

  describe('[Focus Community Builder]', () => {
    const expected = settingsData.expectedCommunityBuilder

    it('[Edit a new profile]', () => {
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(expected.profileType)

      cy.setSettingBasicUserInfo({
        username: user.username,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.setSettingMapPinWorkspace({
        description: expected.mapPinDescription,
        searchKeyword: 'Singa',
        locationName: expected.location.value,
      })

      cy.saveSettingsForm()

      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        user.username,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        expect(docs[0]).to.containSubset({
          about: expected.about,
          // coverimage
          // links
          mapPinDescription: expected.mapPinDescription,
          location: locationStub,
        })
      })
    })
  })

  describe('Focus Plastic Collection Point', () => {
    const expected = settingsData.expectedPlastic

    it('[Edit a new profile]', () => {
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(expected.profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      cy.setSettingBasicUserInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.step('Update Collection section')
      cy.setSettingAddOpeningTime({
        index: 0,
        day: 'Monday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      cy.setSettingAddOpeningTime({
        index: 1,
        day: 'Tuesday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      cy.setSettingAddOpeningTime({
        index: 2,
        day: 'Wednesday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      cy.setSettingAddOpeningTime({
        index: 3,
        day: 'Friday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      cy.setSettingDeleteOpeningTime(0, false)
      cy.setSettingDeleteOpeningTime(1, true)

      cy.get('[data-cy=plastic-hdpe]').click()
      cy.get('[data-cy=plastic-pvc]').click()
      cy.get('[data-cy=plastic-other]').click()

      cy.saveSettingsForm()

      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        user.username,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
    })
  })
})
