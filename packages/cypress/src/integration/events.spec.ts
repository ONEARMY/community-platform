describe('[Events]', () => {
  beforeEach(() => {
    // navigate to events page and wait for data load
    cy.visit('/events')
    cy.get('[data-cy=card]', { timeout: 10000 })
      .its('length')
      // length will be 6 with seed data or 7 with created event
      .should('be.at.least', 6)
  })

  describe('[List events]', () => {
    it('[By Everyone]', () => {
      cy.step('Upcoming events are shown')

      cy.step('Move Events button is hidden')
      cy.get('button').contains('More Events').should('not.visible')

      cy.step(`Basic info of an event is shown`)
      cy.get('[data-cy=card]:contains(SURA BAYA Exhibition)').within(() => {
        cy.contains('18').should('be.exist')
        cy.contains('Aug').should('be.exist')
        cy.contains('SURA BAYA Exhibition').should('be.exist')
        cy.contains('event_creator').should('be.exist')
        cy.contains('East Java').should('be.exist')
        cy.get('a[target=_blank]')
          .should('have.attr', 'href')
          .and('eq', 'https://www.instagram.com/p/B1N6zVUjj0M/')
      })
    })

    it('[By Authenticated]', () => {
      cy.login('event_reader@test.com', 'test1234')
      cy.step('Create button is available')
      cy.get('[data-cy=create-event]').click().url()
    })
  })

  describe('[Filter Events]', () => {
    it('[By Everyone]', () => {
      cy.step('Select a tag in the dropdown list')
      // ensure tags loaded
      cy.selectTag('workshop')
      cy.get('[data-cy=card').its('length').should('eq', 2)

      cy.step('Type and select second tag')
      cy.selectTag('screening')
      cy.get('[data-cy=card').its('length').should('eq', 1)

      cy.step('Remove a tag')
      cy.get('.data-cy__multi-value__label')
        .contains('screening')
        .parent()
        .find('.data-cy__multi-value__remove')
        .click()
      cy.get('[data-cy=card]').its('length').should('be.eq', 2)

      cy.step('Remove all tags')
      cy.get('.data-cy__clear-indicator').click()
      cy.get('.data-cy__multi-value__label').should('not.exist')
      cy.get('[data-cy=card]').its('length').should('be.eq', 7)
    })
  })

  describe('[Create an event]', () => {
    it('[By Authenticated]', () => {
      cy.login('event_creator@test.com', 'test1234')
      cy.get('[data-cy=create-event]').click()

      cy.step('Fill up mandatory info')
      cy.get('[data-cy=title]').type('Create a test event')
      cy.get('[data-cy=date]').find('input').click()
      // make date first of next month (ensure in future)
      const d = new Date(new Date().setDate(new Date().getDate() + 2))
      cy.get('[data-cy="input-date"]').type(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(d.getUTCDate()).padStart(2, '0')}`,
      )
      cy.selectTag('event_testing')
      cy.intercept(
        'GET',
        'https://nominatim.openstreetmap.org/search?format=json&limit=5&q=Atucucho',
        [{ "place_id": 43773071, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright", "osm_type": "node", "osm_id": 3605552095, "boundingbox": ["-0.1489647", "-0.1089647", "-78.5336987", "-78.4936987"], "lat": "-0.1289647", "lon": "-78.5136987", "display_name": "Atucucho, Quito Canton, Pichincha, 170318, Ecuador", "class": "place", "type": "village", "importance": 0.385, "icon": "https://nominatim.openstreetmap.org/ui/mapicons/poi_place_village.p.20.png" }, { "place_id": 110541582, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright", "osm_type": "way", "osm_id": 24595282, "boundingbox": ["-0.1229944", "-0.1229169", "-78.4966957", "-78.4955442"], "lat": "-0.1229632", "lon": "-78.4961544", "display_name": "Atucucho, Quito Norte, San Carlos, Cotocollao, Quito Canton, Pichincha, 170315, Ecuador", "class": "highway", "type": "residential", "importance": 0.21000999999999995 }, { "place_id": 289589639, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright", "osm_type": "way", "osm_id": 1012561203, "boundingbox": ["-0.1229053", "-0.1228171", "-78.4949059", "-78.4942423"], "lat": "-0.1228203", "lon": "-78.4944492", "display_name": "Atucucho, Quito Norte, San Carlos, Cotocollao, Quito Canton, Pichincha, 170315, Ecuador", "class": "highway", "type": "footway", "importance": 0.18500999999999992 }, { "place_id": 746703, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright", "osm_type": "node", "osm_id": 270138840, "boundingbox": ["-0.127946", "-0.127846", "-78.5132014", "-78.5131014"], "lat": "-0.127896", "lon": "-78.5131514", "display_name": "Atucucho, Manuel de Jesus Alvarez Loor, Cochapamba, Atucucho, Quito Canton, Pichincha, 170318, Ecuador", "class": "highway", "type": "bus_stop", "importance": 0.11010000000000002, "icon": "https://nominatim.openstreetmap.org/ui/mapicons/transport_bus_stop2.p.20.png" }, { "place_id": 49626378, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright", "osm_type": "node", "osm_id": 4313278078, "boundingbox": ["-0.1306504", "-0.1305504", "-78.5153499", "-78.5152499"], "lat": "-0.1306004", "lon": "-78.5152999", "display_name": "Atucucho, Antonio Cabezas, Cochapamba, Atucucho, Quito Canton, Pichincha, 170318, Ecuador", "class": "highway", "type": "bus_stop", "importance": 0.11010000000000002, "icon": "https://nominatim.openstreetmap.org/ui/mapicons/transport_bus_stop2.p.20.png" }]
      ).as('osm-geocoding')

      cy.get('[data-cy="osm-geocoding-input"]').type('Atucucho')
      cy.get('[data-cy="osm-geocoding-results"]')
        .find('li:eq(0)', { timeout: 10000 })
        .click()
      // cy.get('[data-cy=tag-select]').click()
      cy.get('[data-cy=url]')
        .type('https://www.meetup.com/pt-BR/cities/br/rio_de_janeiro/')
        .blur()

      cy.step('Publish the event')
      cy.get('[data-cy=submit]').should('not.be.disabled').click()
      cy.step('The new event is shown in /events')
      cy.get('[data-cy=card]')
        .contains('Create a test event')
        .should('be.exist')
    })
  })
})
