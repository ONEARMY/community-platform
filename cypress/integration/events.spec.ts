describe('[Events]', () => {
  const today = '2019-08-15'
  beforeEach(() => {
    cy.log(`Today as **${today}**`)
    cy.clock(Cypress.moment.utc(today).valueOf(), ['Date'])
  })

  describe('[List events]', () => {
    beforeEach(() => {
      cy.visit('/events')
      cy.logout()
    })

    it('[By Everyone]', () => {
      cy.step('The Create button is unavailable')
      cy.get('[data-cy=create]').should('not.exist')

      cy.step('Upcoming events are shown')
      cy.get('[data-cy=card]').its('length').should('be.eq', 5)

      cy.step('Move Events button is hidden')
      cy.get('button').contains('More Events').should('not.visible')

      cy.step(`Basic info of an event is shown`)
      cy.get('[data-cy=card]:has(:contains(SURA BAYA Exhibition))').within(() => {
        cy.contains('18').should('be.exist')
        cy.contains('August').should('be.exist')
        cy.contains('SURA BAYA Exhibition').should('be.exist')
        cy.contains('By event_creator').should('be.exist')
        cy.contains('Surabaya').should('be.exist')
        cy.contains('exhibition').should('be.exist')
        cy.get('a[target=_blank]').should('have.attr', 'href').and('eq', 'https://www.instagram.com/p/B1N6zVUjj0M/')
      })
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

  describe('[Filter Events]', () => {
    it('[By Everyone]', () => {

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
