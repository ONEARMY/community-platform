import { SignInPage } from '../page-objects/sign-in-page'

context('header', () => {
  it('appears on home page', () => {
    cy.visit('/')
    cy.get('[data-cy=header]').should('exist')
  })
  it('contains sign-in button', () => {
    cy.get('[data-cy=sign-in-button]').should('exist')
  })
  it('redirects to sign-in page', () => {
    cy.get('[data-cy=sign-in-button]').click()
    // TODO - integrate with sign-in-page constructor check
    const signInPage = new SignInPage()
    signInPage.checkLoaded()
  })
})
