describe('[Sign in]', () => {
  it('[By Anonymous]', () => {
    cy.step('Lost Password requires email')
    cy.visit('/sign-in')
    cy.get('[data-cy=lost-password]').click()
    cy.get('[data-cy="TextNotification: failure"]').should('be.visible')

    cy.step('Lost Password cannot sent a reset link on wrong email')
    cy.get('[data-cy=email]').clear().type('what_is_mypassword@test.com')
    cy.get('[data-cy=lost-password]').click()
    cy.get('[data-cy="TextNotification: failure"]').should('be.visible')
  })
})
