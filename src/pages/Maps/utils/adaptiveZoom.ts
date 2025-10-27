interface GeocodingResult {
  boundingbox: string[]
}

const ZOOM_LEVELS = {
  LARGE_COUNTRY: 5,
  COUNTRY: 6,
  SMALL_COUNTRY: 7,
  LARGE_STATE: 8,
  STATE: 9,
  CITY: 10,
  TOWN: 11,
  NEIGHBORHOOD: 12,
  STREET: 14,
  ADDRESS: 15,
}

const EXTENT_THRESHOLDS = {
  LARGE_COUNTRY: 10,
  COUNTRY: 5,
  SMALL_COUNTRY: 2,
  LARGE_STATE: 1,
  STATE: 0.5,
  CITY: 0.2,
  TOWN: 0.1,
  NEIGHBORHOOD: 0.05,
  STREET: 0.01,
}

export const getAdaptiveZoomLevel = (
  geocodingResult: GeocodingResult,
): number => {
  const [south, north, west, east] = geocodingResult.boundingbox.map(parseFloat)
  const latitudeSpan = north - south
  const longitudeSpan = east - west
  const maxGeographicExtent = Math.max(latitudeSpan, longitudeSpan)

  if (maxGeographicExtent > EXTENT_THRESHOLDS.LARGE_COUNTRY) {
    return ZOOM_LEVELS.LARGE_COUNTRY
  }
  if (maxGeographicExtent > EXTENT_THRESHOLDS.COUNTRY) {
    return ZOOM_LEVELS.COUNTRY
  }
  if (maxGeographicExtent > EXTENT_THRESHOLDS.SMALL_COUNTRY) {
    return ZOOM_LEVELS.SMALL_COUNTRY
  }
  if (maxGeographicExtent > EXTENT_THRESHOLDS.LARGE_STATE) {
    return ZOOM_LEVELS.LARGE_STATE
  }
  if (maxGeographicExtent > EXTENT_THRESHOLDS.STATE) {
    return ZOOM_LEVELS.STATE
  }
  if (maxGeographicExtent > EXTENT_THRESHOLDS.CITY) {
    return ZOOM_LEVELS.CITY
  }
  if (maxGeographicExtent > EXTENT_THRESHOLDS.TOWN) {
    return ZOOM_LEVELS.TOWN
  }
  if (maxGeographicExtent > EXTENT_THRESHOLDS.NEIGHBORHOOD) {
    return ZOOM_LEVELS.NEIGHBORHOOD
  }
  if (maxGeographicExtent > EXTENT_THRESHOLDS.STREET) {
    return ZOOM_LEVELS.STREET
  }
  return ZOOM_LEVELS.ADDRESS
}
