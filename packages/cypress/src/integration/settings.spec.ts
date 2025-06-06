import { ExternalLinkLabel } from 'oa-shared'

import { MOCK_DATA } from '../data'
import { SingaporeStubResponse } from '../fixtures/searchResults'
import { UserMenuItem } from '../support/commandsUi'
import { generateNewUserDetails } from '../utils/TestUtils'

const settings_member_new = MOCK_DATA.users.settings_member_new

describe('[Settings]', () => {
  beforeEach(() => {
    cy.interceptAddressSearchFetch(SingaporeStubResponse)
  })

  it('[Cancel edit profile and get confirmation]', () => {
    cy.signIn(settings_member_new.email, settings_member_new.password)

    cy.step('Go to User Settings')
    cy.clickMenuItem(UserMenuItem.Settings)
    cy.wait(5000)
    cy.get('[data-cy=displayName').clear().type('Wrong user')

    cy.step('Confirm shown when attempting to go to another page')
    cy.get('[data-cy=page-link]').contains('Library').click()
    cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible')
  })

  describe('[Create Profiles]', () => {
    beforeEach(() => {
      cy.visit('/sign-in')
    })

    it('Can create member', () => {
      // Comprehensive member test above for FF,
      // minimal spec here for PP specific functionality

      const country = 'Bolivia'
      const displayName = 'pp_settings_member_new'
      const description = "I'm a very active member"
      const profileType = 'member'
      const tag = 'Melting'

      const user = generateNewUserDetails()
      cy.signUpNewUser(user)

      cy.visit('/settings')

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
      const url = 'something@test.com'
      const visitorType = 'Open to visitors'
      const visitorDetails =
        'Visitors are welcome between 13:00 and 15:00 every day'
      const impactFields = [
        { name: 'plastic', value: 5 },
        { name: 'revenue', value: 10003 },
        { name: 'employees', value: 7 },
        { name: 'volunteers', value: 28 },
        { name: 'machines', value: 2, visible: false },
      ]
      const user = generateNewUserDetails()
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

      cy.step('Can add contact link and visitor details')
      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.EMAIL,
        url,
      })
      cy.setSettingVisitorPolicy(visitorType, visitorDetails)
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

      cy.step('Can see visitor policy')
      cy.get('[data-cy=tag-openToVisitors]').contains(visitorType).click()
      cy.get('[data-cy=VisitorModal]').contains(visitorDetails)
      cy.get('[data-cy="close"]').click()

      cy.step('Updated settings display on contact tab')
      cy.get('[data-cy="contact-tab"]').click()
      cy.contains(`Other users are able to contact you`)
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

      cy.step('Can remove visitor policy')
      cy.visit('/settings')
      cy.clearSettingVisitorPolicy()
      cy.saveSettingsForm()
      cy.visit(`u/${user.username}`)
      cy.get('[data-cy=tag-openToVisitors]').should('not.exist')
    })
  })
})
