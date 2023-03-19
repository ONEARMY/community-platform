import type { IMapPin } from 'src/models/maps.models'

// filter pins to include matched pin type or subtype
// excluding items which have been marked as deleted=true
export const filterMapPinsByType = (
  mapPins: IMapPin[],
  filters: Array<string>,
) => {
  const filterList = new Set(filters)
  let filteredPins = mapPins

  if (filterList.has('verified')) {
    filteredPins = mapPins.filter((p) => p.verified)
    filterList.delete('verified')
  }

  const filterFn =
    filterList.size === 0
      ? (p) => !p._deleted
      : (p) => !p._deleted && filterList.has(p.subType || p.type)

  return filteredPins.filter(filterFn)
}
