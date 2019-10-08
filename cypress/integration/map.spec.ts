import { MapPage } from '../page-objects/map-page'

context('map', () => {
  it('should navigate without log', () => {
    cy.visit('/map')
    const mapPage = new MapPage()
    mapPage.searchCity()
  })
})
