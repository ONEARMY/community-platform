describe('[Sign in]', () => {
  it('[By Anonymous]', () => {
    cy.step('Login with correct credentials')
    cy.get('[data-cy=email]').clear().type('howto_reader@test.com')
    cy.get('[data-cy=password]').clear().type('test1234')
    cy.get('[data-cy=login-form]').submit()
    cy.get('[data-cy=user-menu]')
  })
})
describe('[Sign-in - authenticated user]', () => {
  it('redirects to home page', () => {
    cy.visit('/sign-in')
    cy.login('howto_reader@test.com', 'test1234')
    cy.visit('/sign-in').url().should('include', '/')
  })
})
