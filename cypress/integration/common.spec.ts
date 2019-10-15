describe('[Common]', () =>{
  it('[Default Page]', () => {
    cy.step('The home page is /how-to')
    cy.visit('/')
      .url().should('include', '/how-to')
  })

  it('[Page Navigation]', () => {
    cy.visit('/how-to')

    cy.step('Go to Events page')
    cy.get('[data-cy=page-link]').contains('Events').click()
    cy.url().should('include', '/events')

    cy.step('Go to Map page')
    cy.get('[data-cy=page-link]').contains('Map').click()
    cy.url().should('include', '/map')

    cy.step('Go to Academy page')
    cy.get('[data-cy=page-link]').contains('Academy').click()
    cy.url().should('include', '/academy')

    cy.step('Go to How-to page')
    cy.get('[data-cy=page-link]').contains('How-to').click()
    cy.url().should('include', '/how-to')
  })

  it('[Main Menu]', () => {
    cy.step('Login and Join buttons are available to the Anonymous')
    cy.visit('/how-to')
    cy.logout()
    cy.get('[data-cy=login]').should('be.visible')
    cy.get('[data-cy=join]').should('be.visible')

    cy.step('Login and Join buttons are unavailable to logged-in users')
    cy.login('howto_reader@test.com', 'test1234')
    cy.get('[data-cy=login]').should('not.exist')
    cy.get('[data-cy=join]').should('not.exist')
    
  })
})