import type { ILatLng, MapPinFormData } from 'oa-shared';

/** Retrieve OSM data for a specific lat-lon */
export const getLocationData = async (latlng: ILatLng): Promise<MapPinFormData> => {
  const { lat, lng } = latlng;
  const response = await (
    await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      {
        headers: new Headers({
          'User-Agent': 'onearmy.earth Community Platform (https://platform.onearmy.earth)',
        }),
      },
    )
  ).json();

  const location: MapPinFormData = {
    country: response.address.country || '',
    countryCode: response.address.country_code || '',
    administrative: response.address.county || '',
    lat: lat,
    lng: lng,
    postCode: response.address.postcode || '',
    name: response.address.city || response.address.town || response.address.village || '',
  };

  return location;
};
