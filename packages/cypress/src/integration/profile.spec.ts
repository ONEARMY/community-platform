import USERS from '../fixtures/seed/users.json'
import { UserMenuItem } from '../support/commands'

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const subscriber = USERS.subscriber
  const admin = USERS.admin

  describe('[By Anonymous]', () => {
    it('[Can view public profile]', () => {
      cy.visit(`/u/${subscriber.userName}`)
      cy.get('[data-cy=userName]').should('contain.text', subscriber.userName)
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
    })
    it('[Cannot edit another user profile]', () => {
      cy.visit(`/u/${admin.userName}`)
      cy.get('[data-cy=userName]').should('contain.text', admin.userName)
      cy.get('[data-cy=adminEdit]').should('not.exist')
      cy.visit(`/u/${admin.userName}/admin`)
      cy.get('[data-cy=auth-route-deny]').should('exist')
    })
  })

  describe('[By Admin]', () => {
    beforeEach(() => {
      cy.login(admin.email, admin.password)
    })
    it.only('[Can edit another user profile]', () => {
      cy.visit(`/u/${subscriber.userName}`)
      cy.get('[data-cy=userDisplayName]').should(
        'contain.text',
        subscriber.displayName,
      )
      cy.get('[data-cy=UserAdminEdit]').click()
      cy.url().should('include', `/u/${subscriber.userName}/admin`)
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
