import { faker } from '@faker-js/faker'
import { ExternalLinkLabel } from 'oa-shared'

import { MESSAGE_MAX_CHARACTERS } from '../../../../src/pages/User/constants'
import { missing } from '../../../../src/pages/User/impact/labels'
import { contact } from '../../../../src/pages/User/labels'
import { MOCK_DATA } from '../data'
import { UserMenuItem } from '../support/commandsUi'
import {
  generateNewUserDetails,
  setIsPreciousPlastic,
} from '../utils/TestUtils'

const { profile_views, subscriber } = MOCK_DATA.users
const eventReader = MOCK_DATA.users.event_reader
const userProfiletype = MOCK_DATA.users.settings_workplace_new
const workspaceEmpty = MOCK_DATA.users.settings_workplace_empty

const betaTester = MOCK_DATA.users['beta-tester']

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('[By Anonymous]', () => {
    it('[Can view all public profile information]', () => {
      cy.step('Go to Profile')
      cy.visit(`/u/${eventReader.userName}`)
      cy.title().should(
        'eq',
        `${eventReader.displayName} - Profile - Precious Plastic`,
      )

      cy.get('[data-cy=userDisplayName]').contains(eventReader.userName)
      cy.get('[data-testid=library-stat]').contains('1')
      cy.get('[data-testid=research-stat]').should('exist')

      cy.step('Cannot see profile views')
      cy.get('[data-testid=profile-views-stat]').should('not.exist')

      cy.get('[data-cy=emptyProfileMessage]').should('not.exist')
    })
  })

  describe('[By User]', () => {
    it('[User directed to own profile]', () => {
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)
      cy.visit('/')

      cy.step('Go to Profile')
      cy.clickMenuItem(UserMenuItem.Profile)
      cy.wait(5000)
      cy.url().should('include', `/u/${user.username}`)
      cy.get('[data-cy=SpaceProfile]').should('not.exist')
      cy.get('[data-cy=MemberProfile]').should('be.visible')
      cy.get('.beta-tester-feature').should('not.exist')
      cy.get('[data-cy=emptyProfileMessage]').should('be.visible')
    })

    it('[Can send a contact message]', () => {
      localStorage.setItem('VITE_NO_MESSAGING', 'false')

      const message = faker.lorem
        .sentences(50)
        .slice(0, MESSAGE_MAX_CHARACTERS)
        .trim()
      const user = generateNewUserDetails()

      cy.step('Can sign-up and have a contact form')
      cy.signUpNewUser(user)
      cy.logout()
      cy.signIn(subscriber.email, subscriber.password)
      cy.step('Go to Profile')
      cy.visit(`/u/${user.username}`)

      cy.step('Go to contact tab')
      cy.get('[data-cy=contact-tab]').click()
      cy.get('[data-cy="UserContactForm"]').should('be.visible')
      cy.contains(`${contact.title} ${user.username}`).should('be.visible')

      cy.step('Form errors without a message')
      cy.get('[data-cy=contact-submit]').click()
      cy.contains('Make sure this field is filled correctly').should(
        'be.visible',
      )

      cy.step('Can send contact form')
      cy.get('[data-cy=name]').type('Bob')
      cy.get('[data-cy=message]').invoke('val', message).blur({ force: true })
      cy.get('[data-cy=contact-submit]').click()
      cy.contains(contact.successMessage)
    })

    it('[Can edit public contact section]', () => {
      localStorage.setItem('VITE_NO_MESSAGING', 'false')

      const user = generateNewUserDetails()

      cy.step('Can sign-up')
      cy.signUpNewUser(user)

      cy.step('Set up public contact section')
      cy.visit('/settings')
      cy.setSettingFocus('workspace')
      cy.setSettingBasicUserInfo({
        displayName: user.username,
        country: 'Bolivia',
        description: 'New profile to test the contact form',
      })
      cy.setSettingImage('profile-cover-1-edited', 'coverImages-0')
      cy.selectTag('Mixed', '[data-cy=tag-select]')
      cy.setSettingAddContactLink({
        index: 0,
        label: ExternalLinkLabel.EMAIL,
        url: 'something@test.com',
      })
      cy.get('[data-cy=PublicContactSection]').should('be.visible')
    })

    it('[Cannot contact when public contact is disabled]', () => {
      localStorage.setItem('VITE_NO_MESSAGING', 'false')

      const user = generateNewUserDetails()

      cy.step('Can sign-up')
      cy.signUpNewUser(user)

      cy.step('Disable public contact')
      cy.visit('/settings')
      cy.setSettingFocus('workspace')
      cy.setSettingBasicUserInfo({
        displayName: user.username,
        country: 'Bolivia',
        description: 'New profile to test the contact form',
      })
      cy.setSettingImage('profile-cover-1-edited', 'coverImages-0')
      cy.get('[data-cy=PublicContactSection]').should('be.visible')
      cy.get('[data-cy=isContactableByPublic-true]').click({ force: true })
      cy.saveSettingsForm()
      cy.get('[data-cy=isContactableByPublic-false]')

      cy.step('Cannot see contact tab')
      cy.logout()
      cy.signIn(subscriber.email, subscriber.password)
      cy.visit(`/u/${user.username}`)
      cy.get('[data-cy=contact-tab]').should('not.exist')
    })

    it("[Can't message users when config set]", () => {
      localStorage.setItem('VITE_NO_MESSAGING', 'true')

      const user = generateNewUserDetails()

      cy.step("Can sign-up and won't have a contact form")
      cy.signUpNewUser(user)
      cy.step('Go to Profile')
      cy.visit(`/u/${user.username}`)

      cy.step('No contact tab')
      cy.get('[data-cy=contact-tab]').should('not.exist')

      cy.step('No setting to turn it on')
      cy.visit('/settings')
      cy.get('[data-cy=PublicContactSection]').should('not.exist')
    })

    it('[Can see impact data for workspaces]', () => {
      setIsPreciousPlastic()

      cy.signIn(subscriber.email, subscriber.password)

      cy.step('Can go to impact data')
      cy.visit(`/u/${userProfiletype.userName}`)
      cy.get('[data-cy=ImpactTab]').click()
      cy.get('[data-cy=ImpactPanel]').should('be.visible')
      cy.contains(missing.user.label)
      cy.contains('2021')
      cy.contains('3 full time employees')
    })

    it('[Can see contribution data for workspaces]', () => {
      setIsPreciousPlastic()

      cy.signIn(subscriber.email, subscriber.password)

      cy.step('Can go to contribution data')
      cy.visit(`/u/${userProfiletype.userName}`)
      cy.get('[data-cy=ContribTab]').click()
    })

    it('[Tabs hidden without contributions]', () => {
      setIsPreciousPlastic()

      cy.signIn(subscriber.email, subscriber.password)

      cy.step('Ensure hidden with no contributions')
      cy.visit(`/u/${workspaceEmpty.userName}`)
      cy.get('[data-cy=MemberProfile]').should('not.exist')
      cy.get('[data-cy=SpaceProfile]').should('be.visible')

      cy.get('[data-cy=ContribTab]').should('not.exist')
      cy.get('[data-cy=ImpactTab]').should('not.exist')
    })

    it('[Cannot see profile views]', () => {
      cy.signIn(subscriber.email, subscriber.password)
      cy.visit(`/u/${profile_views.userName}`)
      cy.get('[data-testid=profile-views-stat]').should('not.exist')
    })

    it('should display questions count on profile tab', () => {
      setIsPreciousPlastic()
      cy.signIn(subscriber.email, subscriber.password)

      cy.visit(`/u/${subscriber.userName}`)

      cy.get('[data-testid=questions-link]').should('be.visible')
      cy.get('[data-testid=questions-stat]')
        .should('be.visible')
        .invoke('text')
        .and('match', /^Questions: \d+$/)
    })

    it('should navigate to questions page when clicking questions count on profile tab', () => {
      setIsPreciousPlastic()
      cy.signIn(subscriber.email, subscriber.password)

      cy.visit(`/u/${subscriber.userName}`)

      cy.get('[data-testid=questions-link]').click()
      cy.url().should('include', `questions`)
    })

    it('should show questions in contributions tab', () => {
      setIsPreciousPlastic()
      cy.signIn(subscriber.email, subscriber.password)

      cy.visit(`/u/${subscriber.userName}`)

      cy.get('[data-cy=ContribTab]').click()
      cy.get('[data-testid="question-contributions"]').should('be.visible')
      cy.get('[data-testid="question-contributions"]')
        .contains('The first test question?')
        .should('be.visible')
    })

    it('should link to question page when question in clicked in contributions tab', () => {
      setIsPreciousPlastic()
      cy.signIn(subscriber.email, subscriber.password)

      cy.visit(`/u/${subscriber.userName}`)
      cy.get('[data-cy=ContribTab]').click()

      cy.get('[data-cy="the-first-test-question-link"]').click()
      cy.url().should(
        'include',
        `/questions/the-first-test-question?utm_source=user-profile`,
      )
      cy.get('[data-cy="question-title"]')
        .should('be.visible')
        .contains('The first test question?')
    })
  })
})

describe('[By Beta Tester]', () => {
  it('[Displays view count for profile with views]', () => {
    cy.signIn(betaTester.email, betaTester.password)
    cy.visit(`/u/${profile_views.userName}`)
    cy.get('[data-testid=profile-views-stat]').contains(/Views: \d+/)
  })
})
