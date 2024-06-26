import { ExternalLinkLabel } from 'oa-shared'

import { form } from '../../../../src/pages/UserSettings/labels'
import { SingaporeStubResponse } from '../fixtures/searchResults'
import * as settingsData from '../fixtures/settings'
import { UserMenuItem } from '../support/commandsUi'
import { DbCollectionName, setIsPreciousPlastic } from '../utils/TestUtils'

import type { IUser } from '../../../../src/models/user.models'

interface Info {
  username: string
  country?: string
  description: string
  coverImage: string
}

interface IMapPin {
  description: string
  searchKeyword: string
  locationName: string
}
type ILink = IUser['links'][0] & { index: number }

describe('[Settings]', () => {
  beforeEach(() => {
    cy.interceptAddressSearchFetch(SingaporeStubResponse)
    setIsPreciousPlastic()
    cy.visit('/sign-in')
  })

  const selectFocus = (focus: string) => {
    cy.get(`[data-cy=${focus}]`).click()
  }

  const setInfo = (info: Info) => {
    cy.step('Update Info section')
    cy.get('[data-cy=username').clear().type(info.username)
    cy.get('[data-cy=info-description').clear().type(info.description)
    cy.get('[data-cy=coverImages-0]').find(':file').attachFile(info.coverImage)
  }

  const setWorkspaceMapPin = (mapPin: IMapPin) => {
    setMemberMapPin(mapPin)
    cy.get('[data-cy="osm-geocoding-input"]').should(($input) => {
      const val = $input.val()
      expect(val).to.include(mapPin.locationName)
    })
  }

  const setMemberMapPin = (mapPin: IMapPin) => {
    cy.step('Add pin')
    cy.get('[data-cy=add-a-map-pin]').click({ force: true })
    cy.get('[data-cy="osm-geocoding-input"]').clear().type(mapPin.searchKeyword)
    cy.get('[data-cy="osm-geocoding-results"]')
    cy.wait('@fetchAddress').then(() => {
      cy.get('[data-cy="osm-geocoding-results"]').find('li:eq(0)').click()
    })
    cy.get('[data-cy=pin-description]').clear().type(mapPin.description)
  }

  const addContactLink = (link: Omit<ILink, 'key'>) => {
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
  }

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
      cy.login('settings_member_new@test.com', 'test1234')

      cy.step('Go to User Settings')
      cy.visit('/settings')
      selectFocus(expected.profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Can set the required fields')
      setInfo({
        username: expected.userName,
        country: expected.country,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        label: ExternalLinkLabel.EMAIL,
        url: `${freshSettings.userName}@test.com`,
      })

      addContactLink({
        index: 1,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url: 'https://social.network',
      })

      // Remove first item
      cy.get('[data-cy="delete-link-0"]').last().trigger('click')
      cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible')
      cy.get('[data-cy="Confirm.modal: Confirm"]').trigger('click')

      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=save]').should('not.be.disabled')

      setMemberMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Singapo',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=save]').should('not.be.disabled')

      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
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
    const freshSettings = settingsData.freshSettingsWorkplace
    const expected = settingsData.expectedWorkplace

    it('[Editing a new Profile]', () => {
      cy.login('settings_workplace_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.visit('/settings')
      selectFocus(expected.profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      cy.get(`[data-cy=${expected.workspaceType}]`).click()
      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })
      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        label: ExternalLinkLabel.EMAIL,
        url: `${freshSettings.userName}@test.com`,
      })
      addContactLink({
        index: 1,
        label: ExternalLinkLabel.WEBSITE,
        url: `http://www.${freshSettings.userName}.com`,
      })

      setWorkspaceMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Singapo',
        locationName: expected.location.value,
      })

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

      cy.step('Opt-in to being contacted by users')
      cy.get('[data-cy=isContactableByPublic]').should('not.be.checked')
      cy.get('[data-cy=isContactableByPublic]').check({ force: true })

      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=save]').should('not.be.disabled')

      cy.step('Verify if all changes were saved correctly')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
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
    const expected = settingsData.expectedMachineBuilder

    it('[Edit a new profile]', () => {
      cy.login('settings_machine_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.visit('/settings')
      selectFocus(expected.profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-2.png',
      })

      cy.step('Choose Expertise')
      cy.get('[data-cy=electronics]').click()
      cy.get('[data-cy=welding]').click()

      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        label: ExternalLinkLabel.BAZAR,
        url: `http://settings_machine_bazarlink.com`,
      })

      setWorkspaceMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'singapo',
        locationName: expected.location.value,
      })

      cy.step('Opts out of public contact')
      cy.get('[data-cy=isContactableByPublic').should('be.checked')
      cy.get('[data-cy=isContactableByPublic').click({ force: true })

      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=save]').should('not.be.disabled')

      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
    })
  })

  describe('[Focus Community Builder]', () => {
    const expected = settingsData.expectedCommunityBuilder

    it('[Edit a new profile]', () => {
      cy.login('settings_community_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.visit('/settings')
      selectFocus(expected.profileType)

      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.step('Update Contact Links')
      expected.links.forEach((link, index) =>
        addContactLink({
          index,
          label: ExternalLinkLabel.WEBSITE,
          url: link.url,
        }),
      )

      setWorkspaceMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Singa',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
    })
  })

  describe('Focus Plastic Collection Point', () => {
    const freshSettings = settingsData.freshSettingsPlastic
    const expected = settingsData.expectedPlastic

    interface IOpeningTime {
      index: number
      day: string
      from: string
      to: string
    }
    const selectOption = (selector: string, selectedValue: string) => {
      cy.selectTag(selectedValue, selector)
    }

    const addOpeningTime = (openingTime: IOpeningTime) => {
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
    }

    const deleteOpeningTime = (index: number, confirmed: boolean) => {
      cy.viewport('macbook-13')
      cy.get(`[data-cy=delete-opening-time-${index}-desk]`).click()
      if (confirmed) {
        cy.get('[data-cy=confirm-delete]').click()
      } else {
        cy.get('[data-cy=cancel-delete]').click()
      }
    }

    it('[Edit a new profile]', () => {
      cy.login('settings_plastic_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.visit('/settings')
      selectFocus(expected.profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url: `http://www.facebook.com/${freshSettings.userName}`,
      })
      addContactLink({
        index: 1,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url: `http://www.twitter.com/${freshSettings.userName}`,
      })

      cy.step('Update Collection section')
      addOpeningTime({
        index: 0,
        day: 'Monday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      addOpeningTime({
        index: 1,
        day: 'Tuesday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      addOpeningTime({
        index: 2,
        day: 'Wednesday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      addOpeningTime({
        index: 3,
        day: 'Friday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      deleteOpeningTime(0, false)
      deleteOpeningTime(1, true)

      cy.get('[data-cy=plastic-hdpe]').click()
      cy.get('[data-cy=plastic-pvc]').click()
      cy.get('[data-cy=plastic-other]').click()

      setWorkspaceMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Singapo',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=save]').should('not.be.disabled')

      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
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
