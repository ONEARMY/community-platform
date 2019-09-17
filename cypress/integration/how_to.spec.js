/// <reference types="Cypress" />

import { HowToPage } from '../page-objects/how-to-page'

context('how-to', () => {
  const howToPage = new HowToPage()

  it('should navigate without login', () => {
    howToPage.navigate()
  })
})
