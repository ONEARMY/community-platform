/// <reference types="Cypress" />

import { EventsPage } from '../page-objects/events-page'

context('how-to', () => {
  const eventsPage = new EventsPage()

  it('should navigate without login', () => {
    eventsPage.navigate()
  })
})
