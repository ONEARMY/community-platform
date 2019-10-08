import { EventsPage } from '../page-objects/events-page'

context('events', () => {
  it('should navigate without login', () => {
    cy.visit('/events')
    const eventsPage = new EventsPage()
  })
})
