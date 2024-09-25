import type { IBoundingBox, IMapPin } from 'oa-shared'

export const latLongFilter = (boundaries: IBoundingBox, pinList: IMapPin[]) => {
  const result = pinList.filter(({ location }) => {
    const inLat =
      location.lat >= boundaries._southWest.lat &&
      location.lat <= boundaries._northEast.lat
    const inLng =
      location.lng >= boundaries._southWest.lng &&
      location.lng <= boundaries._northEast.lng
    return inLat && inLng
  })

  return result
}
