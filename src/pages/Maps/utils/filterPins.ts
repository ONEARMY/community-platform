import type { IMapPin, MapFilterOptionsList } from 'oa-shared'

export const filterPins = (
  activePinFilters: MapFilterOptionsList,
  pins: IMapPin[],
): IMapPin[] => {
  if (activePinFilters.length === 0) {
    return pins
  }
  const profileTypeFilters = activePinFilters
    .filter(({ filterType }) => filterType === 'profileType')
    .map(({ _id }) => _id)

  const filteredPins: IMapPin[] = []

  if (profileTypeFilters.length > 0) {
    const profileTypeFilteredList = pins.filter(
      ({ creator }) =>
        creator?.profileType &&
        profileTypeFilters.includes(creator?.profileType),
    )
    filteredPins.push(...profileTypeFilteredList)
  }

  const profileTagFilters = activePinFilters
    .filter(({ filterType }) => filterType === 'profileTag')
    .map(({ _id }) => _id)

  if (profileTagFilters.length > 0) {
    const listToFilter = filteredPins.length > 0 ? filteredPins : pins
    const tagFilteredList = listToFilter.filter(({ creator }) => {
      const tagIds = creator?.tags?.map(({ _id }) => _id)
      return profileTagFilters.some((tagId) => tagIds?.includes(tagId))
    })
    return tagFilteredList
  }

  return filteredPins.length === 0 ? pins : filteredPins
}
