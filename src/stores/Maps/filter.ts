import type { IMapPin } from 'oa-shared'

// filter pins to include matched pin type or subtype
// excluding items which have been marked as deleted=true
export const filterMapPinsByType = (
  mapPins: IMapPin[],
  filters: string[],
  hideMemberPins: boolean,
) => {
  const filterList = new Set(filters)
  let filteredPins = mapPins

  if (filterList.has('verified')) {
    filteredPins = mapPins.filter((p) => p.verified)
    filterList.delete('verified')
  }

  return filteredPins.filter((pin) => {
    if (filterList.size === 0) {
      // no filter => remove deleted and hide members if precious-plastic
      if (hideMemberPins) {
        return !pin._deleted && pin.type !== 'member'
      }

      return !pin._deleted
    }

    return !pin._deleted && filterList.has(pin.subType || pin.type)
  })
}
