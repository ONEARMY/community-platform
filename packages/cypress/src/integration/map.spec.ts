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

    cy.step('Link to new map visible and clickable')
    cy.get('[data-cy=Banner]').contains('Test it out!').click()
    cy.get('[data-cy=Banner]').contains('go back to the old one!')

    cy.step('New map shows the cards')
    cy.get('[data-cy="welome-header"]').should('be.visible')
    cy.get('[data-cy="CardList-desktop"]').should('be.visible')
    cy.get('[data-cy="list-results"]').contains('51 results')

    cy.step('As the user moves in the list updates')
    for (let i = 0; i < 10; i++) {
      cy.get('.leaflet-control-zoom-in').click()
    }
    cy.get('[data-cy="list-results"]').contains('1 result')
    cy.get('[data-cy="CardList-desktop"]').within(() => {
      cy.get('[data-cy=CardListItem]')
        .within(() => {
          cy.contains(userId)
          cy.get('[data-cy="MemberBadge-member"]')
        })
        .should('have.attr', 'href')
        .and('include', `/u/${userId}`)
    })

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

    cy.step('Mobile list view can be shown/hidden')
    cy.viewport('samsung-note9')
    cy.get('[data-cy="CardList-desktop"]').should('not.be.visible')
    cy.get('[data-cy="CardList-mobile"]').should('not.be.visible')

    cy.get('[data-cy="ShowMobileListButton"]').click()
    cy.get('[data-cy="CardList-mobile"]').within(() => {
      cy.get('[data-cy=CardListItem]')
        .within(() => {
          cy.contains(userId)
          cy.get('[data-cy="MemberBadge-member"]')
        })
        .should('have.attr', 'href')
        .and('include', `/u/${userId}`)
    })

    cy.get('[data-cy="ShowMapButton"]').click()
    cy.get('[data-cy="CardList-mobile"]').should('not.be.visible')
  })
})
