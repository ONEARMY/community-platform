import { ExternalLinkLabel } from 'oa-shared'

import { SingaporeStubResponse } from '../fixtures/searchResults'
import { UserMenuItem } from '../support/commandsUi'
import {
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

const mapDetails = (description) => ({
  description,
  searchKeyword: 'singapo',
  locationName: locationStub.value,
})

describe('[Settings]', () => {
  beforeEach(() => {
    cy.interceptAddressSearchFetch(SingaporeStubResponse)
    setIsPreciousPlastic()
    cy.visit('/sign-in')
  })

  describe('[Focus Member]', () => {
    it('[Cancel edit profile and get confirmation]', (done) => {
      cy.signUpNewUser()

      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)

      cy.get('[data-cy=username').clear().type('Wrong user')

      cy.step('Confirm shown when attempting to go to another page')
      cy.get('[data-cy=page-link]').contains('How-to').click()
      cy.on('window:confirm', (text) => {
        expect(text).to.eq(
          'You are leaving this page without saving. Do you want to continue ?',
        )
        done()
      })
    })

    it('[Edit a new profile]', () => {
      const country = 'AU'
      const coverImage = 'profile-cover-1'
      const displayName = 'settings_member_new'
      const description = "I'm a very active member"
      const mapPinDescription = 'Fun, vibrant and full of amazing people'
      const profileType = 'member'
      const user = generateNewUserDetails()
      const url = 'https://social.network'

      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Can set the required fields')
      cy.setSettingBasicUserInfo({
        username: displayName,
        country,
        description,
        coverImage: `images/${coverImage}.jpg`,
      })

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url: 'http://something.to.delete/',
      })

      cy.setSettingAddContactLink({
        index: 1,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url,
      })

      // Remove first item
      cy.get('[data-cy="delete-link-0"]').last().trigger('click')
      cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible')
      cy.get('[data-cy="Confirm.modal: Confirm"]').trigger('click')

      cy.saveSettingsForm()

      cy.setSettingMapPinMember(mapDetails(mapPinDescription))

      cy.saveSettingsForm()

      cy.step('Updated settings display on profile')
      cy.visit(`u/${user.username}`)
      cy.contains(user.username)
      cy.contains(displayName)
      cy.contains(description)
      cy.get(`[data-cy="MemberBadge-${profileType}"]`)
      cy.get('[data-cy="profile-avatar"]')
        .should('have.attr', 'src')
        .and('include', coverImage)
      cy.get('[data-cy="profile-link"]').should('have.attr', 'href', url)
    })
  })

  describe('[Focus Workplace]', () => {
    it('[Editing a new Profile]', () => {
      const coverImage = 'profile-cover-1-edited'
      const displayName = 'settings_workplace_new'
      const description = 'We have some space to run a workplace'
      const profileType = 'workspace'
      const user = generateNewUserDetails()
      const url = 'something@test.com'

      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      cy.get('[data-cy=shredder').click()
      cy.setSettingBasicUserInfo({
        username: displayName,
        description,
        coverImage: `images/${coverImage}.jpg`,
      })

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.EMAIL,
        url,
      })

      cy.setSettingImpactData()

      cy.saveSettingsForm()

      cy.step('Updated settings display on profile')
      cy.visit(`u/${user.username}`)
      cy.contains(user.username)
      cy.contains(displayName)
      cy.contains(description)
      cy.get(`[data-cy="MemberBadge-${profileType}"]`)
      cy.get('[data-cy="active-image"]')
        .should('have.attr', 'src')
        .and('include', coverImage)

      cy.step('Updated settings display on contact tab')
      cy.get('[data-cy="contact-tab"]').click()
      cy.contains(`Send a message to ${displayName}`)
      cy.get('[data-cy="profile-link"]').should(
        'have.attr',
        'href',
        `mailto:${url}`,
      )
    })
  })

  describe('[Focus Machine Builder]', () => {
    it('[Edit a new profile]', () => {
      const coverImage = 'profile-cover-2-edited'
      const description = "We're mechanics and our jobs are making machines"
      const displayName = 'machine_builder_pro'
      const machineBuilderXp = ['electronics', 'welding']
      const mapPinDescription = 'Informative workshop on machines every week'
      const profileType = 'machine-builder'
      const user = generateNewUserDetails()
      const url = 'https://shop.com/'

      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      cy.setSettingBasicUserInfo({
        username: displayName,
        description,
        coverImage: `images/${coverImage}.png`,
      })

      cy.step('Choose Expertise')
      cy.get(`[data-cy=${machineBuilderXp[0]}]`).click()
      cy.get(`[data-cy=${machineBuilderXp[1]}]`).click()

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.BAZAR,
        url,
      })

      cy.saveSettingsForm()

      cy.setSettingMapPinWorkspace(mapDetails(mapPinDescription))

      cy.setSettingPublicContact()
      cy.saveSettingsForm()

      cy.step('Updated settings display on main profile tab')
      cy.visit(`u/${user.username}`)
      cy.contains(user.username)
      cy.contains(displayName)
      cy.contains(description)
      cy.get(`[data-cy=MemberBadge-${profileType}]`)
      cy.get('[data-cy="active-image"]')
        .should('have.attr', 'src')
        .and('include', coverImage)

      cy.step('Updated settings display on contact tab')
      cy.get('[data-cy="contact-tab"]').click()
      cy.contains(`Send a message to ${displayName}`).should('not.exist')
      cy.get('[data-cy="profile-link"]').should('have.attr', 'href', url)
    })
  })

  describe('[Focus Community Builder]', () => {
    it('[Edit a new profile]', () => {
      const coverImage = 'profile-cover-1-edited'
      const description =
        'An enthusiastic community that makes the world greener!'
      const displayName = 'community_001'
      const profileType = 'community-builder'
      const mapPinDescription = 'Fun, vibrant and full of amazing people'
      const user = generateNewUserDetails()
      const url = 'http://www.settings_community_new-forum.org'

      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(profileType)

      cy.setSettingBasicUserInfo({
        username: displayName,
        description,
        coverImage: `images/${coverImage}.jpg`,
      })

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url,
      })

      cy.saveSettingsForm()

      cy.setSettingMapPinWorkspace(mapDetails(mapPinDescription))

      cy.saveSettingsForm()

      cy.step('Updated settings display on main profile tab')
      cy.visit(`u/${user.username}`)
      cy.contains(user.username)
      cy.contains(displayName)
      cy.contains(description)
      cy.get(`[data-cy=MemberBadge-${profileType}]`)
      cy.get('[data-cy="active-image"]')
        .should('have.attr', 'src')
        .and('include', coverImage)

      cy.step('Updated settings display on contact tab')
      cy.get('[data-cy="contact-tab"]').click()
      cy.contains(`Send a message to ${displayName}`)
      cy.get('[data-cy="profile-link"]').should('have.attr', 'href', url)
    })
  })

  describe('Focus Plastic Collection Point', () => {
    it('[Edit a new profile]', () => {
      const coverImage = 'profile-cover-1'
      const description =
        'We accept plastic currencies: Bottle, Nylon Bags, Plastic Lids/Straws'
      const displayName = 'settings_community_new'
      const openTimes = [
        {
          index: 0,
          day: 'Monday',
          from: '09:00 AM',
          to: '06:00 PM',
        },
        {
          index: 1,
          day: 'Tuesday',
          from: '09:00 AM',
          to: '06:00 PM',
        },
        {
          index: 2,
          day: 'Wednesday',
          from: '10:00 AM',
          to: '08:00 PM',
        },
        {
          index: 3,
          day: 'Friday',
          from: '05:00 AM',
          to: '02:00 PM',
        },
      ]
      const plasticTypes = ['hdpe', 'other']
      const profileType = 'collection-point'
      const user = generateNewUserDetails()
      const url = 'http://www.facebook.com/settings_plastic_new'

      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      cy.setSettingBasicUserInfo({
        username: displayName,
        description,
        coverImage: `images/${coverImage}.jpg`,
      })

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url,
      })

      cy.step('Update collection specific section')
      openTimes.forEach((openTime) => {
        cy.setSettingAddOpeningTime(openTime)
      })
      cy.setSettingDeleteOpeningTime(0, false)
      cy.setSettingDeleteOpeningTime(1, true)

      cy.get(`[data-cy=plastic-${plasticTypes[0]}]`).click()
      cy.get(`[data-cy=plastic-${plasticTypes[1]}]`).click()

      cy.saveSettingsForm()

      cy.step('Updated settings display on main profile tab')
      cy.visit(`u/${user.username}`)
      cy.contains(user.username)
      cy.contains(displayName)
      cy.contains(description)
      cy.get(`[data-cy=MemberBadge-${profileType}]`)
      cy.get('[data-cy="active-image"]')
        .should('have.attr', 'src')
        .and('include', coverImage)

      cy.step('Updated collection specific section displayed')
      cy.get(`[data-cy=plastic-type-${plasticTypes[0]}]`)
      cy.get(`[data-cy=plastic-type-${plasticTypes[1]}]`)
      cy.contains(
        `${openTimes[0].day}: ${openTimes[0].from} - ${openTimes[0].to}`,
      )
      cy.contains(
        `${openTimes[2].day}: ${openTimes[2].from} - ${openTimes[2].to}`,
      )
      cy.contains(
        `${openTimes[3].day}: ${openTimes[3].from} - ${openTimes[3].to}`,
      )

      cy.step('Updated settings display on contact tab')
      cy.get('[data-cy="contact-tab"]').click()
      cy.get('[data-cy="profile-link"]').should('have.attr', 'href', url)
      cy.contains(`Send a message to ${displayName}`)
    })
  })
})
