import { users } from '../data'
import { UserMenuItem } from '../support/commands'

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const subscriber = users.subscriber
  const userProfiletype = users.settings_workplace_new
  const admin = users.admin

  describe('[By Anonymous]', () => {
    it('[Can view public profile]', () => {
      cy.visit(`/u/${subscriber.userName}`)
      cy.get('[data-cy="Username"]').should('contain.text', subscriber.userName)
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

  describe('[By Admin]', () => {
    beforeEach(() => {
      cy.login(admin.email, admin.password)
    })
    it('[Can edit another user profile]', () => {
      cy.visit(`/u/${subscriber.userName}`)
      cy.get('[data-cy=userDisplayName]').should(
        'contain.text',
        subscriber.displayName,
      )
      cy.get('[data-cy=UserAdminEdit]').click()
      cy.url().should('include', `/u/${subscriber.userName}/edit`)
      const editedName = `EDITED ${subscriber.displayName}`
      cy.get("input[name='displayName']")
        .should('have.value', subscriber.displayName)
        .clear()
        .type(editedName)
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.get('[data-cy=save]').click()
      cy.wait(2000)
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.visit(`/u/${subscriber.userName}`)
      cy.get('[data-cy=userDisplayName]').should('contain.text', editedName)
    })
  })
})
