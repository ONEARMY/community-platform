import { Page } from '../utils/test-utils'

describe('[Bugs]', () => {
  it.skip('[693]', () => {
    cy.step('Redirect authenticated users to Home Page')
    cy.visit('/how-to')
    cy.login('howto_reader@test.com', 'test1234')
    cy.wait(3000)

    cy.visit('/sign-up')
      .url().should('include', Page.HOME_PAGE)
  })
  it.skip('[692]', () => {
    cy.step('Edit button should be available to resource owner')
    cy.visit('/how-to')
    cy.login('howto_creator@test.com', 'test1234')
    cy.visit('/how-to/make-glasslike-beams')
    cy.get('[data-cy=edit]').should('be.visible')
  })

  it.skip('[688]', () => {
    const editUrl = '/how-to/set-up-devsite-to-help-coding/edit'
    cy.visit('/how-to')
    cy.completeLogin('howto_editor@test.com', 'test1234')
    cy.visit(editUrl)
    cy.get('[data-cy=submit]').contains('Save Changes').should('be.exist')
    cy.url().should('include', editUrl)
  })

  it.skip('[686]', () => {
    cy.deleteDocuments('v2_events', 'title', '==', 'Create a test event')
    cy.visit('/events')

    cy.login('event_creator@test.com', 'test1234')
    cy.get('[data-cy=create]').click()

    cy.step('Fill up mandatory info')
    cy.get('[data-cy=title]').type('Create a test event')
    cy.get('[data-cy=date]').type(Cypress.moment('2019-08-20').format('YYYY-MM-DD'))
    cy.get('[data-cy=tag-select]').click()
    cy.get('.data-cy__menu').contains('event_testing').click()

    cy.get('[data-cy=location]').find('input:eq(0)').type('Atucucho')
    cy.get('[data-cy=location]').find('div').contains('Atucucho').click()
    cy.get('[data-cy=tag-select]').click()
    cy.get('[data-cy=url]').type('https://www.meetup.com/pt-BR/cities/br/rio_de_janeiro/')

    cy.step('Publish the event')
    cy.get('[data-cy=submit]').click()

    cy.step('The new event is shown in /events')
    cy.get('[data-cy=card]').contains('Create a test event').should('be.exist')
  })

  it.skip('[685]', () => {
    cy.visit('/how-to')
    cy.login('howto_reader@test.com', 'test1234')
    cy.visit('/settings')

    cy.toggleUserMenuOn()
    cy.get('[data-cy=menu-item]').contains('Logout').click()

    cy.url().should('include', '/how-to')
  })

  it.skip('[684]', () => {
    cy.visit('/sign-in')
    cy.step('Lost Password sent a reset link')
    cy.get('[data-cy=email]')
      .clear()
      .type('howto_reader@test.com')
    cy.get('[data-cy=lost-password]').click()
    cy.get('[data-cy=notification-confirmation]').should('be.visible')
  })

  it.skip('[679]', () => {
    cy.step('Ask users to login before creating an event')
    cy.logout()
    cy.visit('/events/create')
    cy.get('div').contains('Please login to access this page')
  })

  it.skip('[676]', () => {
    cy.visit('/how-to/unknown-anything')
    cy.contains(`The page you were looking for was moved or doesn't exist`).should('be.exist')
    cy.get('a').contains('Home').click()
      .url().should('include', Page.HOME_PAGE)
  })

  it.skip('[649]', () => {
    cy.step('Wrong email and wrong password')
    cy.visit('/sign-in')
    cy.get('[data-cy=email').type('wrong_email@test.com')
    cy.get('[data-cy=password').type('anything')
    cy.get('[data-cy=submit').click()
    cy.get('div[color=red]').contains(`Incorrect email`)

    cy.step('Correct email and wrong password')
    cy.get('[data-cy=email').type('howto_reader@test.com')
    cy.get('[data-cy=password').type('wrong_password')
    cy.get('[data-cy=submit').click()
    cy.get('div[color=red]').contains(`Incorrect password`)
  })

  it.skip('[651]', () => {
    cy.visit('/how-to')
    cy.login('howto_reader@test.com', 'test1234')
    cy.step('Redirect to home page when visiting /sign-in')
    cy.visit('/sign-in')
      .url()
      .should('include', Page.HOME_PAGE)
  })

})
