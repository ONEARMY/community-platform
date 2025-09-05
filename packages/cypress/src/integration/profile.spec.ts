import { faker } from '@faker-js/faker'

import { MESSAGE_MAX_CHARACTERS } from '../../../../src/pages/User/constants'
import { contact } from '../../../../src/pages/User/labels'
import { MOCK_DATA } from '../data'
import { UserMenuItem } from '../support/commandsUi'
import {
  generateNewUserDetails,
  setIsPreciousPlastic,
} from '../utils/TestUtils'

const { profile_views, subscriber } = MOCK_DATA.users
const eventReader = MOCK_DATA.users.event_reader
const workspacePopulated = MOCK_DATA.users.settings_workplace_new
const workspaceEmpty = MOCK_DATA.users.settings_workplace_empty

const betaTester = MOCK_DATA.users['beta-tester']

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/')
    localStorage.setItem('VITE_NO_MESSAGING', 'false')
  })

  describe('[By Anonymous]', () => {
    it('[Can view all public profile information]', () => {
      cy.step('Go to Profile')
      cy.visit(`/u/${eventReader.username}`)
      cy.title().should(
        'eq',
        `${eventReader.displayName} - Profile - Precious Plastic`,
      )

      cy.get('[data-cy=userDisplayName]').contains(eventReader.username)
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
      cy.url().should('include', `/u/${user.username}`)
      cy.get('[data-cy=SpaceProfile]').should('not.exist')
      cy.get('[data-cy=MemberProfile]').should('be.visible')
      cy.get('.beta-tester-feature').should('not.exist')
      cy.get('[data-cy=emptyProfileMessage]').should('be.visible')
    })

    it('[Contact form]', () => {
      localStorage.setItem('VITE_NO_MESSAGING', 'false')

      const contactee = generateNewUserDetails()

      cy.step('Can sign-up and have a contact form')
      cy.signUpNewUser(contactee)
      cy.visit(`/u/${contactee.username}`)
      cy.get('[data-cy="UserContactForm-Available"]')

      cy.step("Logged out people can see that they're contactable")
      cy.logout()
      cy.visit(`/u/${contactee.username}`)
      cy.get('[data-cy="UserContactNotLoggedIn"]').should('be.visible')
      cy.get('[data-cy="UserContactNotLoggedIn"]')

      cy.step('Other users can contact people')
      const contacter = generateNewUserDetails()
      cy.signUpNewUser(contacter)
      cy.visit(`/u/${contactee.username}`)
      cy.get('[data-cy="UserContactForm"]').should('be.visible')
      cy.contains(`${contact.title} ${contactee.username}`).should('be.visible')

      cy.step('Form errors without a message')
      cy.get('[data-cy=contact-submit]').click()
      cy.contains('Make sure this field is filled correctly').should(
        'be.visible',
      )

      cy.step('Contact form will send')
      const message = faker.lorem
        .sentences(50)
        .slice(0, MESSAGE_MAX_CHARACTERS)
        .trim()

      cy.get('[data-cy=name]').type('Bob')
      cy.get('[data-cy=message]').should('be.visible').invoke('val', message).blur()
      cy.get('[data-cy=contact-submit]').click()
      cy.contains(contact.successMessage)

      cy.step('Can opt-out of being contacted')
      cy.logout()
      cy.signIn(contactee.email, contactee.password)
      cy.completeUserProfile(contactee.username)
      cy.get('[data-cy=PublicContactSection]').should('be.visible')
      cy.get('[data-cy=isContactable-true]').should('be.visible').click()
      cy.saveSettingsForm()
      cy.get('[data-cy=isContactable-false]')

      cy.step('No contact tab visible for contactee')
      cy.visit(`/u/${contactee.username}`)
      cy.get('[data-cy=contact-tab]').should('not.exist')

      cy.step('No contact tab visible for logged out users')
      cy.logout()
      cy.visit(`/u/${contactee.username}`)
      cy.get('[data-cy=contact-tab]').should('not.exist')

      cy.step('No contact tab visible for other users')
      cy.signIn(contacter.email, contacter.password)
      cy.visit(`/u/${contactee.username}`)
      cy.get('[data-cy=contact-tab]').should('not.exist')

      cy.step('Contact tab shows when website link is present')
      cy.logout()
      cy.signIn(contactee.email, contactee.password)
      cy.visit('/settings')
      cy.get('[data-cy=website').clear().type('https://bbc.co.uk')
      cy.saveSettingsForm()

      cy.visit(`/u/${contactee.username}`)
      cy.get('[data-cy=contact-tab]').click()
      cy.get('[data-cy=UserContactWrapper]')
      cy.get('[data-cy="UserContactForm-NotAvailable"]')
      cy.get('[data-cy="UserContactForm"]').should('not.exist')
      cy.get('[data-cy="profile-website"]').should(
        'have.attr',
        'href',
        `https://bbc.co.uk`,
      )

      cy.step('Contact tab links shows for everyone else')
      cy.logout()
      cy.visit(`/u/${contactee.username}`)
      cy.get('[data-cy="UserContactForm-NotAvailable"]').should('not.exist')
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

      cy.step('No contact form even when links are present')
      cy.get('[data-cy=tab-Profile]').click()
      cy.setSettingImage('avatar', 'userImage')
      cy.setSettingBasicUserInfo({
        displayName: user.username,
        country: 'Tokelau',
        description: 'contact checking',
        website: 'https://greatbritishbakeoff.com',
      })

      cy.saveSettingsForm()

      cy.visit(`/u/${user.username}`)
      cy.get('[data-cy=contact-tab]').click()
      cy.get('[data-cy=UserContactWrapper]').should('not.exist')
    })

    it('[Can see contribution data for workspaces]', () => {
      setIsPreciousPlastic()

      cy.signIn(subscriber.email, subscriber.password)

      cy.step('Can go to contribution data')
      cy.visit(`/u/${workspacePopulated.username}`)
      cy.get('[data-cy=ContribTab]').click()
    })

    it('[Tabs hidden without contributions]', () => {
      setIsPreciousPlastic()

      cy.signIn(subscriber.email, subscriber.password)

      cy.step('Ensure hidden with no contributions')
      cy.visit(`/u/${workspaceEmpty.username}`)
      cy.get('[data-cy=MemberProfile]').should('not.exist')
      cy.get('[data-cy=SpaceProfile]').should('be.visible')

      cy.get('[data-cy=ContribTab]').should('not.exist')
      cy.get('[data-cy=ImpactTab]').should('not.exist')
    })

    it('[Cannot see profile views]', () => {
      cy.signIn(subscriber.email, subscriber.password)
      cy.visit(`/u/${profile_views.username}`)
      cy.get('[data-testid=profile-views-stat]').should('not.exist')
    })

    it('should display questions count on profile tab', () => {
      setIsPreciousPlastic()
      cy.signIn(subscriber.email, subscriber.password)

      cy.visit(`/u/${subscriber.username}`)

      cy.get('[data-testid=questions-link]').should('be.visible')
      cy.get('[data-testid=questions-stat]')
        .should('be.visible')
        .invoke('text')
        .and('match', /^Questions: \d+$/)
    })

    it('should navigate to questions page when clicking questions count on profile tab', () => {
      setIsPreciousPlastic()
      cy.signIn(subscriber.email, subscriber.password)

      cy.visit(`/u/${subscriber.username}`)

      cy.get('[data-testid=questions-link]').click()
      cy.url().should('include', `questions`)
    })

    it('should show questions in contributions tab', () => {
      setIsPreciousPlastic()
      cy.signIn(subscriber.email, subscriber.password)

      cy.visit(`/u/${subscriber.username}`)

      cy.get('[data-cy=ContribTab]').click()
      cy.get('[data-testid="question-contributions"]').should('be.visible')
      cy.get('[data-testid="question-contributions"]')
        .contains('The first test question?')
        .should('be.visible')
    })

    it('should link to question page when question in clicked in contributions tab', () => {
      setIsPreciousPlastic()
      cy.signIn(subscriber.email, subscriber.password)

      cy.visit(`/u/${subscriber.username}`)
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
  describe('badges', () => {
    it('should be shown across the platform', () => {
      cy.step('On profile')
      cy.visit(`/u/${subscriber.username}`)
      cy.get('[data-testid="badge_pro"]').contains('PRO')
      cy.get('[data-testid="Username: pro badge"]')

      cy.step('On project pages')
      cy.get('[data-cy="ContribTab"]').click()
      cy.get('[data-testid="library-link"]').first().click()
      cy.get('[data-cy=library-basis]').get(
        '[data-testid="Username: pro badge"]',
      )

      cy.step('On research pages')
      cy.visit(`/u/${subscriber.username}`)
      cy.get('[data-cy="ContribTab"]').click()
      cy.get('[data-testid="research-link"]').first().click()
      cy.get('[data-testid="Username: pro badge"]')

      cy.step('On question pages')
      cy.visit(`/u/${subscriber.username}`)
      cy.get('[data-cy="ContribTab"]').click()
      cy.get('[data-testid="questions-link"]').first().click()
      cy.get('[data-cy=question-body]').get(
        '[data-testid="Username: pro badge"]',
      )
      cy.get('[data-cy=comments-section]').get(
        '[data-testid="Username: pro badge"]',
      )
    })
  })
})

describe('[By Beta Tester]', () => {
  it('[Displays other information]', () => {
    cy.signIn(betaTester.email, betaTester.password)
    cy.visit(`/u/${profile_views.username}`)
    cy.step('Displays view count for profile with views')
    cy.get('[data-testid=profile-views-stat]').contains(/Views: \d+/)
    cy.step('Displays member history info')
    cy.get('[data-cy=MemberHistory]').contains('Member since')
  })
})
