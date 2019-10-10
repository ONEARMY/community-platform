describe('[Bugs]', () => {
  it.skip('[636]', () => {
    cy.visit('/how-to')
    cy.log('Tags are shown')
    cy.get('[data-cy=card]').contains('Create an extruded lamp').within(($card) => {
      expect($card).to.contain('product')
      expect($card).to.contain('extrusion')
    })
  })

  it.skip('[638]', () => {
    cy.logout()
    cy.visit('/how-to/set-up-devsite-to-help-coding')
    cy.log('Go to the login page')
    cy.get('button').contains('Login').click()
    cy.get('div').contains('Welcome back homie').should('be.exist')
  })
})