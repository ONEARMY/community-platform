import { users } from '../data'
import { UserMenuItem } from '../support/commands'

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const admin = users.admin
  const betaTester = users['beta-tester']
  const eventReader = users.event_reader
  const subscriber = users.subscriber
  const userProfiletype = users.settings_workplace_new

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
    beforeEach(() => {
      cy.login(subscriber.email, subscriber.password)
    })
    it('[User directed to own profile]', () => {
      cy.step('Go to Profile')
      cy.clickMenuItem(UserMenuItem.Profile)
      cy.url().should('include', `/u/${subscriber.userName}`)
      cy.get('[data-cy=spaceProfile]').should('not.exist')
      cy.get('[data-cy=MemberProfile]').should('exist')
      cy.get('.beta-tester-feature').should('not.exist')
    })
    it('[Cannot edit another user profile]', () => {
      cy.visit(`/u/${admin.userName}`)
      cy.get('[data-cy="Username"]').should('contain.text', admin.userName)
      cy.get('[data-cy=adminEdit]').should('not.exist')
      cy.visit(`/u/${admin.userName}/edit`)
      cy.get('[data-cy=BlockedRoute]').should('exist')
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

  describe('[By Beta-Tester]', () => {
    beforeEach(() => {
      cy.login(betaTester.email, betaTester.password)
    })
    it("[Provides links to users' content]", () => {
      const { userName } = eventReader
      cy.step('Views profile of content creator')
      cy.visit(`/u/${userName}`)
      cy.step('Views how-to content of creator')
      cy.get('.beta-tester-feature').should('exist')
      cy.get('[data-testid=how-to-link]').click()
      cy.step('Views research content of creator')
      cy.get('[data-cy=Username]').contains(`${userName}`).click()
      cy.get('[data-testid=research-link]').click()
      cy.get('[data-cy=Username]').contains(`${userName}`).should('exist')
    })
  })
})
