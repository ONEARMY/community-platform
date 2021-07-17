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
      cy.get('button')
        .contains('More Events')
        .should('not.visible')

      cy.step(`Basic info of an event is shown`)
      cy.get('[data-cy=card]:has(:contains(SURA BAYA Exhibition))').within(
        () => {
          cy.contains('18').should('be.exist')
          cy.contains('Aug').should('be.exist')
          cy.contains('SURA BAYA Exhibition').should('be.exist')
          cy.contains('By event_creator').should('be.exist')
          cy.contains('Surabaya').should('be.exist')
          cy.get('a[target=_blank]')
            .should('have.attr', 'href')
            .and('eq', 'https://www.instagram.com/p/B1N6zVUjj0M/')
        },
      )
    })

    it('[By Authenticated]', () => {
      cy.login('event_reader@test.com', 'test1234')
      cy.step('Create button is available')
      cy.get('[data-cy=create-event]')
        .click()
        .url()
    })
  })

  describe('[Filter Events]', () => {
    it('[By Everyone]', () => {
      cy.step('Select a tag in the dropdown list')
      // ensure tags loaded
      cy.selectTag('workshop')
      cy.get('[data-cy=card')
        .its('length')
        .should('eq', 2)

      cy.step('Type and select second tag')
      cy.selectTag('screening')
      cy.get('[data-cy=card')
        .its('length')
        .should('eq', 1)

      cy.step('Remove a tag')
      cy.get('.data-cy__multi-value__label')
        .contains('screening')
        .parent()
        .find('.data-cy__multi-value__remove')
        .click()
      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', 2)

      cy.step('Remove all tags')
      cy.get('.data-cy__clear-indicator').click()
      cy.get('.data-cy__multi-value__label').should('not.exist')
      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', 7)

      cy.step('Filter by location')
      cy.get('[data-cy=location-search]')
        .find('input:eq(0)')
        .type('Suraba')
      cy.get('[data-cy=location-search]')
        .find('span')
        .contains('Surabaya')
        .click()
      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', 2)

      cy.step('Clear location')
      cy.get('button.ap-icon-clear').click()
      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', 7)
    })
  })

  describe('[Create an event]', () => {
    it('[By Authenticated]', () => {
      cy.login('event_creator@test.com', 'test1234')
      // as click event changes depending on logged in state wait to ensure button updated
      // TODO - better to bind attribute to button depending on logged in state to search for
      cy.wait(2000)
      cy.get('[data-cy=create-event]').click()

      cy.step('Fill up mandatory info')
      cy.get('[data-cy=title]').type('Create a test event')
      cy.get('[data-cy=date]')
        .find('input')
        .click()
      // make date first of next month (ensure in future)
      cy.get('.react-datepicker')
        .get('button.react-datepicker__navigation--next')
        .click()
        .get('div.react-datepicker__day--001')
        .first()
        .click()
      cy.selectTag('event_testing')
      cy.get('[data-cy=location-search]')
        .find('input:eq(0)')
        .type('Atucucho')
      cy.get('[data-cy=location-search]')
        .find('div')
        .contains('Atucucho')
        .click()
      // cy.get('[data-cy=tag-select]').click()
      cy.get('[data-cy=url]')
        .type('https://www.meetup.com/pt-BR/cities/br/rio_de_janeiro/')
        .blur()

      cy.step('Publish the event')
      cy.get('[data-cy=submit]')
        .should('not.be.disabled')
        .click()
      cy.step('The new event is shown in /events')
      cy.get('[data-cy=card]')
        .contains('Create a test event')
        .should('be.exist')
    })
  })
})
