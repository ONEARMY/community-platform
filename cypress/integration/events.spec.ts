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
    beforeEach(() => {
      cy.visit('/events')
      cy.logout()
    })
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
      cy.get('[data-cy=location]').find('input:eq(0)').clear().wait(500)
      cy.get('[data-cy=card]').its('length').should('be.eq', 5)
    })
  })

  describe('[Create an event]', () => {

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
