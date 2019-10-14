describe('[Academy]', () => {
  describe('[List instructions]', () => {
    it('[By Everyone]', () => {
      cy.visit('/academy')
      cy.step('Load instructions from another github repo')
      const githubDoc = 'https://onearmy.github.io/academy/intro'
      cy.get('iframe').should('have.attr', 'src').and('equal', githubDoc)
    })
  })
})
