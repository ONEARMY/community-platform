import { faker } from '@faker-js/faker'

import { MESSAGE_MAX_CHARACTERS } from '../../../../src/pages/User/constants'
import { missing } from '../../../../src/pages/User/impact/labels'
import { contact } from '../../../../src/pages/User/labels'
import { MOCK_DATA } from '../data'
import { UserMenuItem } from '../support/commandsUi'
import { setIsPreciousPlastic } from '../utils/TestUtils'

const { admin, profile_views, subscriber } = MOCK_DATA.users
const eventReader = MOCK_DATA.users.event_reader
const machine = MOCK_DATA.users.settings_machine_new
const userProfiletype = MOCK_DATA.users.settings_workplace_new
const workspaceEmpty = MOCK_DATA.users.settings_workplace_empty

const betaTester = MOCK_DATA.users['beta-tester']

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.intercept('POST', '/sendMessage', {
      body: { result: null },
      statusCode: 200,
    }).as('sendMessage')
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
      cy.get('[data-testid=research-stat]').contains('1')

      cy.step('Cannot see profile views')
      cy.get('[data-testid=profile-views-stat]').should('not.exist')

      cy.step('Cannot see contact tab for workspaces')
      cy.visit(`/u/${machine.userName}`)
      cy.contains('[data-cy=contact-tab]').should('not.exist')
    })
  })

  describe('[By User]', () => {
    it('[User directed to own profile]', () => {
      cy.login(subscriber.email, subscriber.password)
      cy.visit('/')

      cy.step('Go to Profile')
      cy.clickMenuItem(UserMenuItem.Profile)
      cy.url().should('include', `/u/${subscriber.userName}`)
      cy.get('[data-cy=SpaceProfile]').should('not.exist')
      cy.get('[data-cy=MemberProfile]').should('be.visible')
      cy.get('.beta-tester-feature').should('not.exist')
      cy.get('[data-cy=contact-tab]').should('not.exist')
    })

    it('[Cannot edit another user profile]', () => {
      cy.login(subscriber.email, subscriber.password)

      cy.visit(`/u/${admin.userName}`)
      cy.get('[data-cy="Username"]').should('contain.text', admin.userName)
      cy.get('[data-cy=adminEdit]').should('not.exist')
      cy.visit(`/u/${admin.userName}/edit`)
      cy.get('[data-cy=BlockedRoute]').should('be.visible')
    })

    it('[Can contact profiles by default]', () => {
      const message = faker.lorem
        .sentences(50)
        .slice(0, MESSAGE_MAX_CHARACTERS)
        .trim()

      cy.login(subscriber.email, subscriber.password)

      cy.step('Go to Profile')
      cy.visit(`/u/${machine.userName}`)

      cy.step('Go to contact tab')
      cy.get('[data-cy=contact-tab]').click()
      cy.contains(`${contact.title} ${machine.userName}`).should('be.visible')

      cy.step('fill in contact form')
      cy.get('[data-cy=name]').type('Bob')

      cy.get('[data-cy=message]').invoke('val', message).blur({ force: true })

      cy.step('Submit form')
      cy.get('[data-cy=contact-submit]').click()
      cy.contains(contact.successMessage)

      cy.step("Can't contact pages who opt-out")
      cy.visit(`/u/${userProfiletype.userName}`)
      cy.contains('[data-cy=contact-tab]').should('not.exist')
    })

    it('[Can see impact data for workspaces]', () => {
      setIsPreciousPlastic()

      cy.login(subscriber.email, subscriber.password)

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

      cy.login(subscriber.email, subscriber.password)

      cy.step('Can go to contribution data')
      cy.visit(`/u/${userProfiletype.userName}`)
      cy.get('[data-cy=ContribTab]').click()
    })

    it('[Tabs hidden without contributions]', () => {
      setIsPreciousPlastic()

      cy.login(subscriber.email, subscriber.password)

      cy.step('Ensure hidden with no contributions')
      cy.visit(`/u/${workspaceEmpty.userName}`)
      cy.get('[data-cy=SpaceProfile]').should('be.visible')
      cy.get('[data-cy=ContribTab]').should('not.exist')
      cy.get('[data-cy=ImpactTab]').should('not.exist')
    })

    it('[Cannot see profile views]', () => {
      cy.login(subscriber.email, subscriber.password)
      cy.visit(`/u/${profile_views.userName}`)
      cy.get('[data-testid=profile-views-stat]').should('not.exist')
    })
  })

  describe('[By User with workspace profile]', () => {
    it('[User directed to own profile]', () => {
      cy.login(userProfiletype.email, userProfiletype.password)
      cy.visit('/')

      cy.step('Go to Profile')
      cy.clickMenuItem(UserMenuItem.Profile)
      cy.url().should('include', `/u/${userProfiletype.userName}`)
      cy.get('[data-cy=MemberProfile]').should('not.exist')
      cy.get('[data-cy=SpaceProfile]').should('be.visible')
    })
  })
})

describe('[By Beta Tester]', () => {
  it('[Displays view count for profile with views]', () => {
    cy.login(betaTester.email, betaTester.password)
    cy.visit(`/u/${profile_views.userName}`)
    cy.get('[data-testid=profile-views-stat]').contains(/Views: \d+/)
  })
})
