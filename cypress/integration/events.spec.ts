describe('[Events]', () => {
  const today = '2019-08-15'
  beforeEach(() => {
    cy.log(`Today as **${today}**`)
    cy.clock(Cypress.moment.utc(today).valueOf(), ['Date'])
    cy.deleteDocuments('v2_events', 'title', '==', 'Create a test event')
    cy.visit('/events')
    cy.logout()
  })

  describe('[List events]', () => {
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
        cy.contains('Aug').should('be.exist')
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
      cy.step('Select a tag in the dropdown list')
      cy.get('[data-cy=tag-select]').click()
      cy.get('.data-cy__menu').contains('workshop').click()
      cy.get('[data-cy=card').its('length').should('eq', 3)

      cy.step('Type and select a tag')
      cy.get('.data-cy__input').find('input').type('scree')
      cy.get('.data-cy__menu').contains('screening').click()
      cy.get('[data-cy=card').its('length').should('eq', 2)

      cy.step('Remove a tag')
      cy.get('.data-cy__multi-value__label').contains('screening')
        .parent()
        .find('.data-cy__multi-value__remove')
        .click()
      cy.get('[data-cy=card]').its('length').should('be.eq', 3)

      cy.step('Remove all tags')
      cy.get('.data-cy__clear-indicator').click()
      cy.get('.data-cy__multi-value__label').should('not.exist')
      cy.get('[data-cy=card]').its('length').should('be.eq', 5)

      cy.step('Filter by location')
      cy.get('[data-cy=location]').find('input:eq(0)').type('Suraba')
      cy.get('[data-cy=location]').find('span').contains('Surabaya').click()
      cy.get('[data-cy=card]').its('length').should('be.eq', 2)

      cy.step('Clear location')
      cy.get('button.ap-icon-clear').click()
      cy.get('[data-cy=card]').its('length').should('be.eq', 5)
    })
  })

  describe('[Create an event]', () => {
    it('[By Authenticated]', () => {
      cy.login('event_creator@test.com', 'test1234')
      cy.get('[data-cy=create]').click()

      cy.step('Fill up mandatory info')
      cy.get('[data-cy=title]').type('Create a test event')
      cy.get('[data-cy=date]').find('input').click()
      cy.get('.react-datepicker').find('div[role=option]').contains('20').click()
      cy.get('[data-cy=tag-select]').click()
      cy.get('.data-cy__menu').contains('event_testing').click()

      cy.get('[data-cy=location]').find('input:eq(0)').type('Atucucho')
      cy.get('[data-cy=location]').find('div').contains('Atucucho').click()
      cy.get('[data-cy=tag-select]').click()
      cy.get('[data-cy=url]').type('https://www.meetup.com/pt-BR/cities/br/rio_de_janeiro/')

      cy.step('Publish the event')
      cy.screenClick()
      cy.get('[data-cy=submit]').click()

      cy.step('The new event is shown in /events')
      cy.get('[data-cy=card]').contains('Create a test event').should('be.exist')
    })
  })
})
