import { HowToPage } from '../page-objects/how-to-page'

context('how-to', () => {
  it('should navigate without login', () => {
    cy.visit('/how-to')
    const howToPage = new HowToPage()
  })
})
