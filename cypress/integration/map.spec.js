/// <reference types="Cypress" />

import { MapPage } from '../page-objects/map-page'

context('map', () => {
  const mapPage = new MapPage()

  it('should navigate without log', () => {
    mapPage.navigate()
  })
})
