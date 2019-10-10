describe('[Bugs]', () => {
  it.skip('Tags shown on how-to load [#636]', () => {
    cy.visit('/how-to')
    cy.log('Tags are shown')
    cy.get('[data-cy=card]')
      .contains('Create an extruded lamp')
      .within($card => {
        expect($card).to.contain('product')
        expect($card).to.contain('extrusion')
      })
  })

  it.skip('Displays message when no how-tos found [#639]', () => {
    cy.visit('/how-to')
    cy.get('[data-cy=tag-select]').click()
    cy.get('.data-cy__menu')
      .contains('extrusion')
      .click()
    cy.get('[data-cy=tag-select]').click()
    cy.get('.data-cy__menu')
      .contains('howto_testing')
      .click()
    // TODO - replace with appropriate expected text once coded
    cy.get('div')
      .contains('loading...')
      .should('not.exist')
  })

  it.skip('Load create how-to page directly [#640]', () => {
    cy.visit('/how-to')
    cy.logout()
    cy.login('howto_creator@test.com', 'test1234')
    cy.log('Open the create-how-to page with its url')
    cy.visit('/how-to/create')
      .url()
      .should('include', '/how-to/create')
    cy.get('div')
      .contains('How-to Guidelines')
      .should('be.exist')
  })

  it.skip('Prevent duplicate howto [#]', () => {
    const createHowto = () => {
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
        .uploadFiles([
          'images/howto-step-pic1.jpg',
          'images/howto-step-pic2.jpg',
        ])

      cy.get('[data-cy=submit]').click()
      cy.wait(6000)
      cy.get('[data-cy=view-howto]')
        .click()
        .url()
        .should('include', '/how-to/create-a-howto-test')
      cy.get('[data-cy=how-to-basis]')
        .contains('Create a how-to test')
        .its('length')
        .should('be.eq', 1)
    }
    cy.deleteDocuments('v2_howtos', 'title', '==', 'Create a how-to test')
    createHowto()
    createHowto()
    cy.visit('/how-to')
  })
})
