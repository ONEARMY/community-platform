import { Page } from '../utils/test-utils'

describe('[Academy]', () => {
  it('1st', () => {
    cy.visit(Page.ACADEMY)
    cy.step('Load instructions from another github repo')
    const githubDoc = 'https://onearmy.github.io/academy/intro'
    cy.get('iframe').should('have.attr', 'src').and('equal', githubDoc)
  })
  it('2nd', () => {
    cy.visit(Page.ACADEMY)
    cy.step('Load instructions from another github repo')
    const githubDoc = 'https://onearmy.github.io/academy/intro'
    cy.get('iframe').should('have.attr', 'src').and('equal', githubDoc)
  })
  it('3rd', () => {
    cy.visit(Page.ACADEMY)
    cy.step('Load instructions from another github repo')
    const githubDoc = 'https://onearmy.github.io/academy/intro'
    cy.get('iframe').should('have.attr', 'src').and('equal', githubDoc)
  })
})
