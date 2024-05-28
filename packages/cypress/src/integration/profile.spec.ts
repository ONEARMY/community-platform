import { faker } from '@faker-js/faker'

import { MESSAGE_MAX_CHARACTERS } from '../../../../src/pages/User/constants'
import { missing } from '../../../../src/pages/User/impact/labels'
import { contact } from '../../../../src/pages/User/labels'
import { MOCK_DATA } from '../data'
import { UserMenuItem } from '../support/commandsUi'
import { setIsPreciousPlastic } from '../utils/TestUtils'

const { admin, subscriber } = MOCK_DATA.users
const eventReader = MOCK_DATA.users.event_reader
const machine = MOCK_DATA.users.settings_machine_new
const userProfiletype = MOCK_DATA.users.settings_workplace_new

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('[By Anonymous]', () => {
    it('[Can view all public profile information]', () => {
      cy.step('Go to Profile')
      cy.visit(`/u/${eventReader.userName}`)
      cy.get('[data-cy=userDisplayName]').contains(eventReader.userName)
      cy.get('[data-testid=howto-stat]').contains('1')
      cy.get('[data-testid=research-stat]').contains('1')

      cy.step("Can't see contact tab for workspaces")
      cy.visit(`/u/${machine.userName}`)
      cy.contains('[data-cy=contact-tab]').should('not.exist')
    })
  })

  describe('[By User]', () => {
    it('[User directed to own profile]', () => {
      cy.login(subscriber.email, subscriber.password)

      cy.step('Go to Profile')
      cy.clickMenuItem(UserMenuItem.Profile)
      cy.url().should('include', `/u/${subscriber.userName}`)
      cy.get('[data-cy=spaceProfile]').should('not.exist')
      cy.get('[data-cy=MemberProfile]').should('exist')
      cy.get('.beta-tester-feature').should('not.exist')
    })

    it('[Cannot edit another user profile]', () => {
      cy.login(subscriber.email, subscriber.password)

      cy.visit(`/u/${admin.userName}`)
      cy.get('[data-cy="Username"]').should('contain.text', admin.userName)
      cy.get('[data-cy=adminEdit]').should('not.exist')
      cy.visit(`/u/${admin.userName}/edit`)
      cy.get('[data-cy=BlockedRoute]').should('exist')
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
      cy.contains(`${contact.title} ${machine.userName}`).should('exist')

      cy.step('fill in contact form')
      cy.get('[data-cy=name]').type('Bob')

      cy.get('[data-cy=message]').invoke('val', message).blur({ force: true })

      cy.step('Submit form')
      cy.get('[data-cy=contact-submit]').click()
      cy.contains(contact.successMessage).should('exist')

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
      cy.get('[data-cy=ImpactPanel]').should('exist')
      cy.contains(missing.user.label)
      cy.contains('2021')
      cy.contains('3 full time employees')
    })
  })

  describe('[By User with workspace profile]', () => {
    beforeEach(() => {
      cy.login(userProfiletype.email, userProfiletype.password)
    })
    it('[User directed to own profile]', () => {
      cy.step('Go to Profile')
      cy.clickMenuItem(UserMenuItem.Profile)
      cy.url().should('include', `/u/${userProfiletype.userName}`)
      cy.get('[data-cy=MemberProfile]').should('not.exist')
      cy.get('[data-cy=SpaceProfile]').should('exist')
    })
  })
})
