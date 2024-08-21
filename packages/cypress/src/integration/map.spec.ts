const userId = 'davehakkens'

describe('[Map]', () => {
  it('[Shows expected pins]', () => {
    cy.viewport('macbook-16')

    cy.step('Shows all pins onload')
    cy.visit('/map')

    cy.step('Old map pins can be clicked on')
    cy.get(`[data-cy=pin-${userId}]`).click()
    cy.get('[data-cy=MapMemberCard]').within(() => {
      cy.get('[data-cy=Username]').contains(userId)
    })
    cy.url().should('include', `#${userId}`)

    cy.step('Old map pins can be hidden')
    cy.get('.markercluster-map').click(0, 0)
    cy.get('[data-cy=MapMemberCard]').should('not.exist')
    cy.url().should('not.include', `#${userId}`)

    cy.step('Link to new map only visible and clickable on desktop')
    cy.viewport('samsung-note9')
    cy.get('[data-cy=Banner]').should('not.be.visible')
    cy.viewport('ipad-2')
    cy.get('[data-cy=Banner]').should('not.be.visible')
    cy.viewport('macbook-16')
    cy.get('[data-cy=Banner]').contains('Test it out!').click()

    cy.step('New map shows the cards')
    cy.get('[data-cy="welome-header"]').should('be.visible')
    cy.get('[data-cy="list-results"]').contains('51 results')

    cy.step('As the user moves in the list updates')
    for (let i = 0; i < 10; i++) {
      cy.get('.leaflet-control-zoom-in').click()
    }
    cy.get('[data-cy="list-results"]').contains('1 result')
    cy.get('[data-cy=CardListItem]')
      .within(() => {
        cy.contains(userId)
        cy.get('[data-cy="MemberBadge-member"]')
      })
      .should('have.attr', 'src')
      .and('include', `/u/${userId}`)

    cy.step('New map pins can be clicked on')
    cy.get(`[data-cy=pin-${userId}]`).click()
    cy.get('[data-cy=MapMemberCard]').within(() => {
      cy.get('[data-cy=Username]').contains(userId)
    })
    cy.url().should('include', `#${userId}`)

    cy.step('New map pins can be hidden')
    cy.get('.markercluster-map').click(0, 0)
    cy.get('[data-cy=MapMemberCard]').should('not.exist')
    cy.url().should('not.include', `#${userId}`)
  })
})
