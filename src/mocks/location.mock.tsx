import { ILocation } from 'src/components/LocationSearch/LocationSearch'

/**
 * Generate mock location data matching algolia places format
 * @param i Optional - provide a specific location index
 * 1:Twickenham, 2:Eindhoven, 3:Brighton, 4:Paris, 5:Madrid
 */
export const MOCK_LOCATION = (i?: number) => {
  // pick random location from list below
  return i
    ? LOCATIONS[i]
    : LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
}

// Example outputs generated at: https://community.algolia.com/places/
const LOCATIONS: ILocation[] = [
  {
    name: 'Twickenham',
    administrative: 'England',
    country: 'United Kingdom',
    countryCode: 'gb',
    latlng: {
      lat: 51.4468,
      lng: -0.328339,
    },
    postcode: 'TW1 3RZ',
    value:
      'Twickenham, London Borough of Richmond upon Thames, England, United Kingdom',
  },
  {
    name: 'Eindhoven',
    administrative: 'Noord-Brabant',
    country: 'The Netherlands',
    countryCode: 'nl',
    latlng: {
      lat: 51.4393,
      lng: 5.47863,
    },
    postcode: '5611',
    value: 'Eindhoven, Noord-Brabant, The Netherlands',
  },
  {
    name: 'Brighton',
    administrative: 'England',
    country: 'United Kingdom',
    countryCode: 'gb',
    latlng: {
      lat: 50.8419,
      lng: -0.12791,
    },
    postcode: 'BN2',
    value: 'Brighton, England, United Kingdom',
  },
  {
    name: 'Paris',
    administrative: 'Île-de-France',
    country: 'France',
    countryCode: 'fr',
    latlng: {
      lat: 48.8546,
      lng: 2.34771,
    },
    postcode: '75000',
    value: 'Paris, Île-de-France, France',
  },
  {
    name: 'Madrid',
    administrative: 'Comunidad de Madrid',
    country: 'Spain',
    countryCode: 'es',
    latlng: {
      lat: 40.4167,
      lng: -3.70358,
    },
    postcode: '28001',
    value: 'Madrid, Comunidad de Madrid, Spain',
  },
]
