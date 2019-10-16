describe('[Events]', () => {

  before(() => {
    cy.deleteDocuments('v2_events', 'title', '==', 'Create an Event test')
    const today = '2019-08-15'
    cy.log(`Today as **${today}**`)
    cy.clock(Cypress.moment.utc(today).valueOf(), ['Date'])
  })

  beforeEach(() => {
    cy.visit('/events')
    cy.logout()
  })

  describe('[List events]', () => {
    // const howtoUrl = '/how-to/make-glasslike-beams'
    // const coverFileRegex = /howto-beams-glass-0-3.jpg/

    it('[By Everyone]', () => {
      cy.step('The Create button is unavailable')
      cy.get('[data-cy=create]').should('not.exist')

      cy.step('Upcoming events are shown')
      cy.get('[data-cy=card]').its('length').should('be.eq', 5)

      cy.step('No tag is selected')
      // - Create button is unavailable
      // - No tag is selected
      // - No location is inputted
      // - More Events button is hidden
      // - Some latest events are shown
      // - The summary of an event is shown, including: date, title, organizer, location and tag
      // - Click on the event's button
      // - Check if it takes users to the event's page in a new tab"
    })

    it('[By Authenticated]', () => {
      cy.login('event_reader@test.com', 'test1234')
      cy.step('Create button is available')
      cy.get('[data-cy=create]')
        .click()
        .url()
        .should('include', '/events/create')

    })
  })

  describe('[Filter with Tag]', () => {
    it('[By Everyone]', () => {
      cy.step('Select a tag')
      // - Select a tag on the dropdown list
      // - Check if only relevant events are shown
      // - Remove the selected tag
      // - Expect all events are shown again"
    })
  })

  describe('[Filter by Location]', () => {
    it('[By Everyone]', () => {
      cy.step('Select the Location')
      // - Select the text box, Search for a Location
      // - Type a location incompletely
      // - Select the desired location from the suggestion list
      // - Check if only relevant events are shown
      // - Remove the location
      // - Expet all events are shown again"
    })
  })

  describe('[Create an event]', () => {
    it('[By Anonymous]', () => {
      cy.visit('/events/create')
        .url()
        .should('not.include', '/create')
    })

    it.skip('[By Authenticated]', () => {
      cy.visit('/events')
      cy.login('event_creator@test.com', 'test1234')
      cy.get('[data-cy=create]').click()

      cy.step('Fill up the intro')
      cy.get('[data-cy=title]').type('Create an Event test')
      const todaysDate = Cypress.moment().format('YYYY-MM-DD')
      cy.get('[data-cy=date]').type(todaysDate)
      cy.get('[data-cy=location]').type('Rio de Janeiro, Brazil')
      cy.get('.ap-name')
        .contains('Rio')
        .click()
      cy.get('[data-cy=tag-select]').click()
      cy.get('[data-cy=url]').type('https://www.meetup.com/pt-BR/cities/br/rio_de_janeiro/')
      cy.get('Publish').click()
    })
  })

  describe('[Edit an event]', () => {
    it('[By Anonymous]', () => {
      cy.visit('/events')
      // ...
    })

    it('[By Authenticated]', () => {
      cy.visit('/events')
      // ...
    })
  })

  describe('[Read an event]', () => {
    it('[By Anonymous]', () => {
      cy.visit('/events')
      // ...
    })

    it('[By Authenticated]', () => {
      cy.visit('/events')
      // ...
    })
  })
})
