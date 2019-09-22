import { SignUpPage } from '../page-objects/sign-up-page'

context('sign-up', () => {
  it('should create user', () => {
    cy.visit('/sign-up')
    const signUpPage = new SignUpPage()
    signUpPage.createUser().goHome()
  })
})
