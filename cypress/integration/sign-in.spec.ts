import { SignInPage } from '../page-objects/sign-in-page'

context('sign-in', () => {
  it('should login', () => {
    cy.visit('/sign-in')
    const signInPage = new SignInPage()
    signInPage.login()
  })
})
