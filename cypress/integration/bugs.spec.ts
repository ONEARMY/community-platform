describe('[Bugs]', () => {
  it.skip('[#636]', () => {
    cy.visit('/how-to')
    cy.step('Tags shown on how-to load')
    cy.get('[data-cy=card]')
      .contains('Create an extruded lamp')
      .within($card => {
        expect($card).to.contain('product')
        expect($card).to.contain('extrusion')
      })
  })
})