describe('[Sign in]', () => {
  it('[By Anonymous]', () => {
    cy.step('Reset Password requires email')
    cy.visit('/sign-in')
    cy.get('[data-cy=lost-password]').click()
    cy.get('[data-cy=email]').should('be.visible')
  })
})
