import type { ILatLng, ILocation } from 'src/models'

/** Retrieve OSM data for a specific lat-lon */
export const getLocationData = async (latlng: ILatLng): Promise<ILocation> => {
  const { lat, lng } = latlng
  const response = await (
    await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      {
        headers: new Headers({
          'User-Agent':
            'onearmy.earth Community Platform (https://platform.onearmy.earth)',
        }),
      },
    )
  ).json()

  const location = {
    name: response.display_name || '',
    country: response.address.country || '',
    countryCode: response.address.country_code || '',
    administrative: response.address.county || '',
    latlng,
    postcode: response.address.postcode || '',
    value:
      response.address.city ||
      response.address.town ||
      response.address.village ||
      '',
  }

  return location
}
