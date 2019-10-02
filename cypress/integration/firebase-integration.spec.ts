describe('FireBase + Cypress', () => {
  it('should logout and login', () => {
    cy.visit('/how-to')
    cy.log('Log-out')
    cy.logout()
    cy.get('[data-cy=create]').should('not.exist')
    cy.login()
    cy.log('Log-in')
    cy.get('[data-cy=create]').should('be.visible')
    cy.logout()
    cy.log('Log-out again')
    cy.get('[data-cy=create]').should('not.exist')
  })
  it('should write/set into FireStore', () => {
    const TEST_UID = '5UXRly49EOXtIXmKjPfSU5UpeI73'
    cy.log('Starting test')
    cy.callFirestore('set', `testCollection/${TEST_UID}`, {
      name: 'superman',
      age: 45,
    })
    cy.callFirestore('get', `testCollection/${TEST_UID}`).then(userInfo => {
      console.log('user created with info', userInfo)
    })
  })
})
