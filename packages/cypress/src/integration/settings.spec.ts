import { ExternalLinkLabel } from 'oa-shared'

import { SingaporeStubResponse } from '../fixtures/searchResults'
import { UserMenuItem } from '../support/commandsUi'
import { generateNewUserDetails } from '../utils/TestUtils'

const locationStub = {
  administrative: '',
  country: 'Singapore',
  countryCode: 'sg',
  latlng: { lng: '103.8194992', lat: '1.357107' },
  postcode: '578774',
  value: 'Singapore',
}

const mapDetails = {
  searchKeyword: 'singapo',
  locationName: locationStub.value,
}

describe('[Settings]', () => {
  beforeEach(() => {
    cy.interceptAddressSearchFetch(SingaporeStubResponse)
  })

  it('[Cancel edit profile and get confirmation]', () => {
    cy.signUpNewUser()

    cy.step('Go to User Settings')
    cy.clickMenuItem(UserMenuItem.Settings)

    cy.get('[data-cy=displayName').clear().type('Wrong user')

    cy.step('Confirm shown when attempting to go to another page')
    cy.get('[data-cy=page-link]').contains('Library').click()
    cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible')
  })

  describe('[Fixing Fashion]', () => {
    beforeEach(() => {
      localStorage.setItem('VITE_PLATFORM_PROFILES', 'member,space')
      localStorage.setItem('VITE_THEME', 'fixing-fashion')
      cy.visit('/sign-in')
    })

    it('Can create member', () => {
      cy.viewport('macbook-16')

      const country = 'Bolivia'
      const userImage = 'avatar'
      const displayName = 'settings_member_new'
      const description = "I'm a very active member"
      const profileType = 'member'
      const tag = ['Sewing', 'Accounting']
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
      cy.selectTag(tag[0], '[data-cy=tag-select]')
      cy.selectTag(tag[1], '[data-cy=tag-select]')
      cy.get('[data-cy="country:BO"]')

      cy.step('Errors if trying to upload invalid image')
      cy.get(`[data-cy=userImage]`)
        .find(':file')
        .attachFile(`images/file.random`)
      cy.get('[data-cy=ImageUploadError]').should('be.visible')
      cy.get('[data-cy=ImageUploadError-Button]').click()

      cy.step('Can add avatar')
      cy.setSettingImage(userImage, 'userImage')

      cy.step("Can't add cover image")
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
      cy.contains(country)
      cy.contains(tag[0])
      cy.contains(tag[1])
      cy.get('[data-cy="country:bo"]')
      cy.get(`[data-cy="MemberBadge-${profileType}"]`)
      cy.get('[data-cy="profile-avatar"]')
        .should('have.attr', 'src')
        .and('include', userImage)

      cy.step('Can add map pin')
      cy.get('[data-cy=EditYourProfile]').click({ force: true })
      cy.get('[data-cy="tab-Map"]').click()
      cy.get('[data-cy=descriptionMember').should('be.visible')
      cy.contains('No map pin currently saved')
      cy.fillSettingMapPin(mapDetails)
      cy.get('[data-cy=save-map-pin]').click()
      cy.contains('Map pin saved successfully')
      cy.contains('Your current map pin is here:')
      cy.contains(locationStub.country)

      cy.step('Setting map pin makes location field disappear')
      cy.get('[data-cy="tab-Profile"]').click()
      cy.get('[data-cy=location-dropdown]').should('not.exist')

      cy.step('Can view pin on new map')
      cy.visit(`/map#${user.username}`)
      cy.wait(2000)
      cy.get('[data-cy=CardListItem-selected]').contains(user.username)

      cy.step('Can delete map pin')
      cy.visit('/settings')
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

    it('Can create space', () => {
      cy.signUpNewUser()
      const coverImage = 'profile-cover-1-edited'
      const userImage = 'avatar'
      const displayName = 'new_ff_space'
      const description = 'We have some space to run a workplace'
      const profileType = 'space'
      const tag = 'Recolor'
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
      cy.setSettingBasicUserInfo({
        displayName,
        description,
      })
      cy.selectTag(tag, '[data-cy=tag-select]')

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
      cy.contains(tag)
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
    })
  })

  describe('[Precious Plastic]', () => {
    beforeEach(() => {
      localStorage.setItem(
        'VITE_PLATFORM_PROFILES',
        'member,workspace,community-builder,collection-point,machine-builder',
      )
      localStorage.setItem('VITE_THEME', 'precious-plastic')
      cy.visit('/sign-in')
    })

    it('Can create member', () => {
      // Comprehensive member test above for FF,
      // minimal spec here for PP specific functionality

      const country = 'Bolivia'
      const displayName = 'settings_member_new'
      const description = "I'm a very active member"
      const profileType = 'member'
      const user = generateNewUserDetails()
      const tag = 'Melting'

      cy.signUpNewUser(user)
      cy.get('[data-cy=complete-profile-button]').click()

      cy.step('Can set the required fields')
      cy.setSettingFocus(profileType)
      cy.setSettingBasicUserInfo({
        displayName,
        country,
        description,
      })
      cy.selectTag(tag, '[data-cy=tag-select]')
      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url: 'http://something.to.delete/',
      })
      cy.saveSettingsForm()

      cy.step('Updated settings display on profile')
      cy.visit(`u/${user.username}`)
      cy.contains(tag)
    })

    it('Can create space', () => {
      const coverImage = 'profile-cover-1-edited'
      const userImage = 'avatar'
      const displayName = 'settings_workplace_new'
      const description = 'We have some space to run a workplace'
      const profileType = 'workspace'
      const tag = 'Shredder'
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
      cy.setSettingBasicUserInfo({
        displayName,
        description,
      })
      cy.selectTag(tag, '[data-cy=tag-select]')

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
      cy.contains(tag)
      cy.get('[data-cy="ImpactTab"]').should('not.exist')
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

      cy.step('Can change to Machine Builder')
      cy.visit('/settings')
      const machineBuilderXp = ['Electronics', 'Welding']
      cy.setSettingFocus('machine-builder')
      cy.selectTag(machineBuilderXp[0], '[data-cy=tag-select]')
      cy.selectTag(machineBuilderXp[1], '[data-cy=tag-select]')
      cy.saveSettingsForm()
      cy.visit(`u/${user.username}`)
      cy.get(`[data-cy="MemberBadge-machine-builder"]`)
      cy.contains(machineBuilderXp[0])
      cy.contains(machineBuilderXp[1])

      cy.step('Can change to Community Builder')
      cy.visit('/settings')
      const communityXp = 'Host Events'
      cy.setSettingFocus('community-builder')
      cy.selectTag(communityXp, '[data-cy=tag-select]')
      cy.saveSettingsForm()
      cy.visit(`u/${user.username}`)
      cy.get(`[data-cy="MemberBadge-community-builder"]`)
      cy.contains(communityXp)

      cy.step('Can change to Collection Point')
      cy.visit('/settings')
      const collectionXp = 'HDPE'
      cy.setSettingFocus('collection-point')
      cy.selectTag(collectionXp, '[data-cy=tag-select]')
      cy.saveSettingsForm()
      cy.visit(`u/${user.username}`)
      cy.get(`[data-cy="MemberBadge-collection-point"]`)
      cy.contains(collectionXp)
    })
  })

  describe('[Project Kamp]', () => {
    beforeEach(() => {
      localStorage.setItem('VITE_PLATFORM_PROFILES', 'member')
      localStorage.setItem('VITE_THEME', 'project-kamp')
      cy.visit('/sign-in')
    })

    it('[Member]', () => {
      // Comprehensive member test above for FF,
      // minimal spec here for PK specific functionality

      cy.signUpNewUser()
      cy.visit('/settings')
      cy.contains('Infos')
      cy.get('[data-cy=FocusSection]').should('not.exist')

      const country = 'Bolivia'
      const displayName = 'settings_member_new'
      const description = "I'm a very active member"
      const tag = 'Landscaping'
      const user = generateNewUserDetails()

      cy.signUpNewUser(user)
      cy.get('[data-cy=complete-profile-button]').click()

      cy.step('Can set the required fields')
      cy.setSettingBasicUserInfo({
        displayName,
        country,
        description,
      })
      cy.selectTag(tag, '[data-cy=tag-select]')
      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.SOCIAL_MEDIA,
        url: 'http://something.to.delete/',
      })
      cy.saveSettingsForm()

      cy.step('Updated settings display on profile')
      cy.visit(`u/${user.username}`)
      cy.contains(tag)
    })
  })
})
