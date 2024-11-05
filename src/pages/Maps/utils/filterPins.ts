import type { IMapPin, MapFilterOptionsList } from 'oa-shared'

export const filterPins = (
  activePinFilters: MapFilterOptionsList,
  allPinsInView: IMapPin[],
): IMapPin[] => {
  const profileTypeFilters = activePinFilters
    .filter(({ filterType }) => filterType === 'profileType')
    .map(({ _id }) => _id)

  const filteredPins: IMapPin[] = []

  if (profileTypeFilters.length > 0) {
    const profileTypeFilteredList = allPinsInView.filter(
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
    const listToFilter = filteredPins.length > 0 ? filteredPins : allPinsInView
    const tagFilteredList = listToFilter.filter(({ creator }) => {
      const tagIds = creator?.tags?.map(({ _id }) => _id)
      return profileTagFilters.some((tagId) => tagIds?.includes(tagId))
    })
    return tagFilteredList
  }

  return filteredPins.length === 0 ? allPinsInView : filteredPins
}
