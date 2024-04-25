// Load map pins base from environment configuration
const API_BASE_URL = 'https://experiment-0424-sze2iv2xoq-lm.a.run.app'

const getMapPins = () => {
  // TODO: Introduce error handling
  return fetch(API_BASE_URL + '/map-pins').then((response) => response.json())
}

export const mapPinService = {
  getMapPins,
}
