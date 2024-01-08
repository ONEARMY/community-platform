import { faker } from '@faker-js/faker'

import { MESSAGE_MAX_CHARACTERS } from '../../../../src/pages/User/constants'
import { contact } from '../../../../src/pages/User/labels'
import { users } from '../data'
import { UserMenuItem } from '../support/commands'

const { admin, subscriber } = users
const betaTester = users['beta-tester']
const eventReader = users.event_reader
const machine = users.settings_machine_new
const userProfiletype = users.settings_workplace_new

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

    it('[Can contact profiles with contact opt-in]', () => {
      cy.login(betaTester.email, betaTester.password)

      const message = faker.lorem
        .sentences(50)
        .slice(0, MESSAGE_MAX_CHARACTERS)
        .trim()

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
    })

    // Temporarily commented out for the transition period
    //
    // import { missing } from '../../../../src/pages/User/impact/labels'
    //
    // it('[Can see impact data for workspaces]', () => {
    //   cy.login(betaTester.email, betaTester.password)

    //   cy.step('Can go to impact data')
    //   cy.visit(`/u/${userProfiletype.userName}`)
    //   cy.get('[data-cy=ImpactTab]').click()
    //   cy.get('[data-cy=ImpactPanel]').should('exist')
    //   cy.contains(missing.owner.label)
    //   cy.contains('2021')
    //   cy.contains('3 full time employees')
    // })
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
