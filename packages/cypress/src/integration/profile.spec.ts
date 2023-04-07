import { users } from '../data'
import { UserMenuItem } from '../support/commands'

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const subscriber = users.subscriber
  const userProfiletype = users.settings_workplace_new
  const admin = users.admin

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
    })
    it('[Cannot edit another user profile]', () => {
      cy.visit(`/u/${admin.userName}`)
      cy.get('[data-cy="Username"]').should('contain.text', admin.userName)
      cy.get('[data-cy=adminEdit]').should('not.exist')
      cy.visit(`/u/${admin.userName}/edit`)
      cy.get('[data-cy=auth-route-deny]').should('exist')
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
