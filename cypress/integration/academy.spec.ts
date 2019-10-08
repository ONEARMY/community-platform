import { AcademyPage } from '../page-objects/academy-page'

context('academy', () => {
  it('should navigate without login', () => {
    cy.visit('/academy')
    const academyPage = new AcademyPage()
  })
})
