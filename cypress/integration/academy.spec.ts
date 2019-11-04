import { Page } from '../utils/test-utils'

describe('[Academy]', () => {
  it('Wait for the app to be ready', () => {
    cy.wait(60000)
  })
  describe('[List instructions]', () => {
    it('[By Everyone]', () => {
      cy.visit(Page.ACADEMY)
      cy.step('Load instructions from another github repo')
      const githubDoc = 'https://onearmy.github.io/academy/intro'
      cy.get('iframe').should('have.attr', 'src').and('equal', githubDoc)
    })
  })
})
