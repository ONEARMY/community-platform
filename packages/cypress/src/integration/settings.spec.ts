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
    it('[Cancel edit profile and get confirmation]', () => {
      cy.signUpNewUser()

      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)

      cy.get('[data-cy=displayName').clear().type('Wrong user')

      cy.step('Confirm shown when attempting to go to another page')
      cy.get('[data-cy=page-link]').contains('How-to').click()
      cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible')
    })

    it('[Edit a new profile]', () => {
      const country = 'Brazil'
      const userImage = 'avatar'
      const displayName = 'settings_member_new'
      const description = "I'm a very active member"
      const mapPinDescription = 'Fun, vibrant and full of amazing people'
      const profileType = 'member'
      const user = generateNewUserDetails()
      const url = 'https://social.network'

      cy.step('Incomplete profile banner visible when logged out')
      cy.get('[data-cy=notificationBanner]').should('not.exist')

      cy.signUpNewUser(user)

      cy.step('Incomplete profile banner visible')
      cy.get('[data-cy=emailNotVerifiedBanner]').should('be.visible')
      cy.get('[data-cy=incompleteProfileBanner]').click()

      cy.step('Member profile badge shown in header by default')
      cy.get(`[data-cy=MemberBadge-${profileType}]`)

      cy.setSettingFocus(profileType)

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')
      cy.get('[data-cy=CompleteProfileHeader]').should('be.visible')

      cy.step('Can set the required fields')
      cy.setSettingBasicUserInfo({
        displayName,
        country,
        description,
      })

      cy.step('Can add avatar only')
      cy.setSettingImage(userImage, 'userImage')
      cy.get('[data-cy=coverImages]').should('not.exist')

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

      cy.step('Incomplete profile prompts no longer visible')
      cy.get('[data-cy=incompleteProfileBanner]').should('not.exist')
      cy.get('[data-cy=CompleteProfileHeader]').should('not.exist')
      cy.get('[data-cy=emailNotVerifiedBanner]').should('be.visible')

      cy.step('User image shown in header')
      cy.get('[data-cy="header-avatar"]')
        .should('have.attr', 'src')
        .and('include', userImage)

      cy.step('Updated settings display on profile')
      cy.visit(`u/${user.username}`)
      cy.contains(user.username)
      cy.contains(displayName)
      cy.contains(description)
      cy.get(`[data-cy="MemberBadge-${profileType}"]`)
      cy.get('[data-cy="profile-avatar"]')
        .should('have.attr', 'src')
        .and('include', userImage)
      cy.get('[data-cy="profile-link"]').should('have.attr', 'href', url)

      cy.step('Can add map pin')
      cy.get('[data-cy=EditYourProfile]').click()
      cy.get('[data-cy="tab-Map"]').click()
      cy.get('[data-cy=descriptionMember').should('be.visible')
      cy.contains('No map pin currently saved')
      cy.fillSettingMapPin(mapDetails(mapPinDescription))
      cy.get('[data-cy=save-map-pin]').click()
      cy.contains('Map pin saved successfully')
      cy.contains('Your current map pin is here:')
      cy.contains(locationStub.country)

      cy.step('Setting map pin makes location field disappear')
      cy.get('[data-cy="tab-Profile"]').click()
      cy.get('[data-cy=location-dropdown]').should('not.exist')

      cy.step('Can delete map pin')
      cy.get('[data-cy="tab-Map"]').click()
      cy.get('[data-cy=remove-map-pin]').click()
      cy.get('[data-cy="Confirm.modal: Confirm"]').click()
      cy.contains('No map pin currently saved')
      cy.get('[data-cy="tab-Profile"]').click()
      cy.get('[data-cy=location-dropdown]').should('be.visible')

      cy.step('Can update email notification preference')
      cy.get('[data-cy="tab-Notifications"]').click()
      cy.get('.data-cy__single-value').last().should('have.text', 'Weekly')
      cy.selectTag('Daily', '[data-cy=NotificationSettingsSelect]')
      cy.get('[data-cy=save-notification-settings]').click()
      cy.contains('Notification setting saved successfully')
      cy.get('.data-cy__single-value').last().should('have.text', 'Daily')
    })
  })

  describe('[Focus Workplace]', () => {
    it('[Editing a new Profile]', () => {
      const coverImage = 'profile-cover-1-edited'
      const userImage = 'avatar'
      const displayName = 'settings_workplace_new'
      const description = 'We have some space to run a workplace'
      const profileType = 'workspace'
      const user = generateNewUserDetails()
      const url = 'something@test.com'
      const impactFields = [
        { name: 'plastic', value: 5 },
        { name: 'revenue', value: 10003 },
        { name: 'employees', value: 7 },
        { name: 'volunteers', value: 28 },
        { name: 'machines', value: 2, visible: false },
      ]

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
        displayName,
        description,
      })

      cy.step('Can add avatar and cover image')
      cy.setSettingImage(userImage, 'userImage')
      cy.setSettingImage(coverImage, 'coverImages-0')

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.EMAIL,
        url,
      })
      cy.saveSettingsForm()

      cy.step('Updated settings display on profile')
      cy.visit(`u/${user.username}`)
      cy.contains(user.username)
      cy.contains(displayName)
      cy.contains(description)
      cy.get(`[data-cy="MemberBadge-${profileType}"]`)
      cy.get('[data-cy="userImage"]')
        .should('have.attr', 'src')
        .and('include', userImage)
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

      cy.step('Set and display impact data')
      cy.visit('/settings')
      cy.setSettingImpactData(2022, impactFields)
      cy.visit(`u/${user.username}`)
      cy.get('[data-cy="ImpactTab"]').click()

      // From visibleImpactFields above
      cy.contains('5 Kg of plastic recycled')
      cy.contains('USD 10,003 revenue')
      cy.contains('7 full time employees')
      cy.contains('28 volunteers')
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
      cy.get('[data-cy=CompleteProfileHeader]').should('be.visible')

      cy.step("Can't save without required fields being populated")
      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Populate profile')
      cy.setSettingBasicUserInfo({
        displayName,
        description,
      })
      cy.setSettingImage(coverImage, 'coverImages-0')

      cy.step('Choose Expertise')
      cy.get(`[data-cy=${machineBuilderXp[0]}]`).click()
      cy.get(`[data-cy=${machineBuilderXp[1]}]`).click()

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.BAZAR,
        url,
      })

      cy.setSettingPublicContact()
      cy.saveSettingsForm()
      cy.get('[data-cy=CompleteProfileHeader]').should('not.exist')

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

      cy.step('Can add map pin')
      cy.get('[data-cy=EditYourProfile]').click()
      cy.get('[data-cy="link-to-map-setting"]').click()
      cy.get('[data-cy=descriptionSpace').should('be.visible')
      cy.get('[data-cy=WorkspaceMapPinRequiredStars').should('be.visible')
      cy.contains('No map pin currently saved')
      cy.fillSettingMapPin(mapDetails(mapPinDescription))
      cy.get('[data-cy=save-map-pin]').click()
      cy.contains('Map pin saved successfully')
      cy.contains('Your current map pin is here:')
      cy.contains(locationStub.country)
    })
  })

  describe('[Focus Community Builder]', () => {
    it('[Edit a new profile]', () => {
      const coverImage = 'profile-cover-1-edited'
      const description =
        'An enthusiastic community that makes the world greener!'
      const displayName = 'community_001'
      const profileType = 'community-builder'
      const user = generateNewUserDetails()
      const url = 'http://www.settings_community_new-forum.org'

      cy.signUpNewUser(user)

      cy.step('Go to User Settings')
      cy.visit('/settings')
      cy.setSettingFocus(profileType)

      cy.setSettingBasicUserInfo({
        displayName,
        description,
      })
      cy.setSettingImage(coverImage, 'coverImages-0')

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url,
      })

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
        displayName,
        description,
      })
      cy.setSettingImage(coverImage, 'coverImages-0')

      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url,
      })

      cy.step('Update collection specific section')
      openTimes.forEach((openTime) => {
        cy.setSettingAddOpeningTime(openTime)
      })
      cy.setSettingDeleteOpeningTime(1, false)
      cy.setSettingDeleteOpeningTime(2, true)

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
        `${openTimes[1].day}: ${openTimes[1].from} - ${openTimes[1].to}`,
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
