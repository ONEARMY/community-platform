import { generateNewUserDetails } from '../utils/TestUtils'

describe('[Sign in]', () => {
  it('[By Anonymous]', () => {
    cy.step('Reset Password requires email')
    cy.visit('/sign-in')
    cy.get('[data-cy=lost-password]').click()
    cy.get('[data-cy=email]').should('be.visible')
  })
})

describe('[Reset password]', () => {
  it('Validate reset password form', () => {
    const user = generateNewUserDetails()
    const { email } = user

    cy.step('Reset Password requires email')
    cy.visit('/sign-in')
    cy.get('[data-cy=lost-password]').click()
    cy.wait(200)
    cy.get('[data-cy=email]').type(email)
    cy.get('[data-cy=submit]').click()

    cy.step('Reset Password should go back')
    cy.get('[data-cy=go-back]').should('be.visible')
    cy.wait(200)
    cy.get('[data-cy=go-back]').click()
    cy.get('[data-cy=email]').should('be.visible')
  })
})
