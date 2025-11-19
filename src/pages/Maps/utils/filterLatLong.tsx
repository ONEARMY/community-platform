import type { IBoundingBox, MapPin } from 'oa-shared';

export const latLongFilter = (boundaries: IBoundingBox, pinList: MapPin[]) => {
  const result = pinList.filter(({ lat, lng }) => {
    const inLat = lat >= boundaries._southWest.lat && lat <= boundaries._northEast.lat;
    const inLng = lng >= boundaries._southWest.lng && lng <= boundaries._northEast.lng;
    return inLat && inLng;
  });

  return result;
};
