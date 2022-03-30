import { IMapPin } from 'src/models/maps.models'

export function filterMapPinsByType(
  mapPins: IMapPin[],
  filters: Array<string>,
) {
  // filter pins to include matched pin type or subtype
  // excluding items which have been marked as deleted=true
  return mapPins.filter(
    (pin) =>
      !pin._deleted &&
      (pin.subType
        ? filters.includes(pin.subType)
        : filters.includes(pin.type)),
  )
}
