import { HowToPage } from '../page-objects/how-to-page'

const shouldTestBugs = false

if (shouldTestBugs) {
  describe('[Bugs]', () => {
    it('[636]', () => {
      cy.visit('/how-to')
      cy.log('Tags are shown')
      cy.get('[data-cy=card]')
        .contains('Create an extruded lamp')
        .within($card => {
          expect($card).to.contain('product')
          expect($card).to.contain('extrusion')
        })
    })

    it('[639]', () => {
      cy.visit('/how-to')
      cy.get('[data-cy=tag-select]').click()
      cy.get('.data-cy__menu')
        .contains('extrusion')
        .click()
      cy.get('[data-cy=tag-select]').click()
      cy.get('.data-cy__menu')
        .contains('howto_testing')
        .click()

      cy.get('div')
        .contains('loading...')
        .should('not.exist')
    })

    it('[640]', () => {
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
  })
}
