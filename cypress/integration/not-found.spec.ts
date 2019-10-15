describe('[Not Found]', () => {
  it('[By Everyone]',() => {
    const unknownUrl = '/abcdefghijklm'
    cy.visit(unknownUrl)
    cy.contains('404').should('be.exist')
    cy.contains(`The page you were looking for was moved or doesn't exist`).should('be.exist')
    cy.get('a').contains('Home').should('have.attr', 'href').and('eq', '/')
  })
})