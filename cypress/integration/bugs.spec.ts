import { Page } from '../utils/test-utils'

describe('[Bugs]', () => {

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

  it.skip('[646]', () => {
    cy.deleteDocuments('v2_howtos', 'title', '==', 'Create a how-to test')

    cy.visit('/how-to')
    cy.login('howto_creator@test.com', 'test1234')
    cy.get('[data-cy=create]').click()

    cy.step('Fill up the intro')
    cy.get('[data-cy=intro-title').type('Create a how-to test')
    cy.get('[data-cy=tag-select]').click()
    cy.get('.data-cy__menu')
      .contains('howto_testing')
      .click()

    cy.get('[data-cy=time-select]').click()
    cy.get('.data-cy__menu')
      .contains('1-2 weeks')
      .click()

    cy.get('[data-cy=difficulty-select]').click()
    cy.get('.data-cy__menu')
      .contains('Medium')
      .click()
    cy.get('[data-cy=intro-description]').type(
      'After creating, the how-to will be deleted',
    )
    cy.get('[data-cy=intro-caption]').type('Intro caption goes here ...')

    cy.step('Upload a cover for the intro')
    cy.get('[data-cy=intro-cover]')
      .find(':file')
      .uploadFiles('images/howto-intro.jpg')

    cy.step('Add steps')
    cy.get('[data-cy=step]')
      .its('length')
      .should('be.eq', 3)
    cy.get('button[data-cy=add-step]').click()
    cy.get('[data-cy=step]')
      .its('length')
      .should('be.eq', 4)

    cy.get('[data-cy=delete-step]').each($el => {
      $el.trigger('click')
      cy.get('[data-cy=confirm]:visible').click()
    })
    cy.get('[data-cy=step]:visible')
      .its('length')
      .should('be.eq', 1)

    cy.step('Fill up a step info')
    cy.get('[data-cy=step]:eq(0)').within($firstStep => {
      cy.wrap($firstStep)
        .contains('Step 1')
        .should('be.exist')
      cy.get('[data-cy=step-title]').type('First step is easy')
      cy.get('[data-cy=step-description]').type(
        'Description for the first step',
      )
      cy.get('[data-cy=step-caption]').type('What a step caption')
      cy.get('[data-cy=delete-step]').should('not.exist')
    })
    cy.step('Upload pics for a step')
    cy.get('[data-cy=step]:visible')
      .find(':file')
      .uploadFiles(['images/howto-step-pic1.jpg', 'images/howto-step-pic2.jpg'])

    cy.get('[data-cy=submit]').click()
    cy.step(`Wait till it's done and click View How-to button`)
    cy.get('[data-cy=view-howto]')
      .click()
      .url()
      .should('include', '/how-to/create-a-howto-test')
    cy.get('[data-cy=how-to-basis]')
      .contains('Create a how-to test')
      .its('length')
      .should('be.eq', 1)
  })
})
