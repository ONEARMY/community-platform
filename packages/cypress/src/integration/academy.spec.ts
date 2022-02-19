import { Page } from '../utils/test-utils'

describe('[Academy]', () => {
  describe('[List instructions]', () => {
    it('[By Everyone]', () => {
      cy.visit(Page.ACADEMY)
      cy.step('Load instructions from another github repo')
      const githubDoc = 'https://onearmy.github.io/academy'
      cy.get('iframe')
        .should('have.attr', 'src')
        .and('contain', githubDoc)
    })
  })
})
