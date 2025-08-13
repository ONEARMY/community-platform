const username = 'demo_user'
const urlLondon =
  'https://nominatim.openstreetmap.org/search?format=json&q=london&accept-language=en'

describe('[Map]', () => {
  it('[Shows expected pins]', () => {
    localStorage.setItem('VITE_THEME', 'fixing-fashion')
    cy.viewport('macbook-16')

    cy.step('Shows all pins onload')
    cy.visit('/map')
    cy.title().should('include', `Map`)

    cy.step('No filters selected by default')
    cy.visit('/map')
    cy.get('[data-cy=MemberTypeVerticalList]')
      .first()
      .within(() => {
        cy.get('[data-cy="MemberTypeVerticalList-Item-active"]').should(
          'have.length',
          0,
        )
      })

    cy.step('Shows the cards')
    cy.get('[data-cy="CardList-desktop"]').should('be.visible')
    cy.get('[data-cy="list-results"]').contains(/\d+ results in view/)

    cy.step('Map filters can be used')
    cy.get('[data-cy=MemberTypeVerticalList]')
      .first()
      .within(() => {
        cy.get('[data-cy=MemberTypeVerticalList-Item]').should(
          'not.have.length',
          0,
        )
      })
    cy.get('[data-cy=MemberTypeVerticalList-Item]').first().click()

    cy.get('[data-cy=MemberTypeVerticalList-Item-active]').first().click()
    cy.get('[data-cy="list-results"]').contains(/\d+ results in view/)

    cy.step('Clusters show up')
    cy.get('.icon-cluster-many')
      .first()
      .within(() => {
        cy.get('.icon-cluster-text').contains(/\d+/)
      })

    cy.step('Users can select filters')
    cy.get('[data-cy=MapFilterList]').should('not.exist')
    cy.get('[data-cy=MapFilterList-OpenButton]').first().click()
    cy.get('[data-cy=MapFilterList]').should('be.visible')
    cy.get('[data-cy=MapFilterListItem-profile]').first().click()
    cy.get('[data-cy=MapFilterListItem-profile-active]').first().click()
    cy.get('[data-cy=MapFilterListItem-tag]').first().click()
    cy.get('[data-cy=MapFilterListItem-tag-active]').first().click()
    cy.get('[data-cy=MapFilterList-ShowResultsButton]').first().click()

    cy.step('As the user moves in the list updates')
    cy.visit(`/map#${username}`)
    cy.wait(2000) // Wait for animation to complete
    for (let i = 0; i < 9; i++) {
      cy.get('.leaflet-control-zoom-in').click()
    }
    cy.wait(2000) // Wait for animation to complete
    cy.get('[data-cy="list-results"]').contains('1 result')
    cy.get('[data-cy="CardList-desktop"]').within(() => {
      cy.get('[data-cy=CardListItem-selected]').within(() => {
        cy.contains(username)
        cy.get('[data-cy="MemberBadge-member"]')
      })
    })
    cy.get('[data-cy="PinProfile"]')
      .get('[data-cy="Username"]')
      .contains(username)
    cy.get('[data-cy=CardListItem-selected]').first().click()

    cy.step('Map pins can be clicked on')
    cy.get(`[data-cy=pin-${username}]`).click()
    cy.get('[data-cy=PinProfile]').within(() => {
      cy.get('[data-cy=Username]').contains(username)
      cy.get('[data-cy=ProfileTagsList]').contains('Sheetpress')
    })
    cy.url().should('include', `#${username}`)

    cy.step('Map pins can be hidden with the cross button')
    cy.get('[data-cy=PinProfile]').should('be.visible')
    cy.get('[data-cy=PinProfileCloseButton]').click()
    cy.url().should('not.include', `#${username}`)
    cy.get('[data-cy=PinProfile]').should('not.exist')
    cy.get(`[data-cy=pin-${username}]`).click()
    cy.url().should('include', `#${username}`)

    cy.step('New map pins can be hidden by clicking the map')
    cy.get('[data-cy=PinProfile]').should('be.visible')
    cy.get('.markercluster-map').click(10, 10)
    cy.url().should('not.include', `#${username}`)
    cy.get('[data-cy=PinProfile]').should('not.exist')

    cy.step('Mobile list view can be shown')
    cy.viewport('samsung-note9')
    cy.get('.leaflet-control-zoom-out').click()
    cy.get('.leaflet-control-zoom-out').click()
    cy.get('.leaflet-control-zoom-out').click()
    cy.get('[data-cy="CardList-desktop"]').should('not.be.visible')
    cy.get('[data-cy="CardList-mobile"]').should('not.be.visible')

    cy.get('[data-cy="ShowMobileListButton"]').click()
    cy.get('[data-cy="CardList-mobile"]').within(() => {
      cy.get('[data-cy=CardListItem]')
        .first()
        .within(() => {
          cy.contains(username)
          cy.get('[data-cy="MemberBadge-member"]')
        })
    })

    cy.step('Mobile list view can be hidden')
    cy.get('[data-cy="ShowMapButton"]').click()
    cy.get('[data-cy="CardList-mobile"]').should('not.be.visible')

    cy.step('The whole map can be searched')
    cy.get('[data-cy="ShowMobileListButton"]').click()
    cy.get('[data-cy=osm-geocoding]').last().click().type('london')
    cy.intercept(urlLondon).as('londonSearch')
    cy.wait('@londonSearch')
    cy.contains('London, Greater London, England, United Kingdom').click()
  })
})
