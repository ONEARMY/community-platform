import type { IMapPin, MapFilterOptionsList } from 'oa-shared'

export const filterPins = (
  activePinFilters: MapFilterOptionsList,
  allPinsInView: IMapPin[],
): IMapPin[] => {
  if (activePinFilters.length === 0) return allPinsInView

  const typeFilters = activePinFilters
    .filter(({ filterType }) => filterType === 'profileType')
    .map(({ _id }) => _id)

  let filteredPins: IMapPin[] = []

  if (typeFilters.length > 0) {
    const profileTypeFilteredList = allPinsInView.filter(
      ({ creator }) =>
        creator?.profileType && typeFilters.includes(creator?.profileType),
    )
    filteredPins.push(...profileTypeFilteredList)
  }

  const tagFilters = activePinFilters
    .filter(({ filterType }) => filterType === 'profileTag')
    .map(({ _id }) => _id)

  if (tagFilters.length > 0) {
    const listToFilter = filteredPins.length > 0 ? filteredPins : allPinsInView
    const tagFilteredList = listToFilter.filter(({ creator }) => {
      const tagIds = creator?.tags?.map(({ _id }) => _id)
      return tagFilters.some((tagId) => tagIds?.includes(tagId))
    })
    filteredPins = tagFilteredList
  }

  const badgeFilters = activePinFilters
    .filter(({ filterType }) => filterType === 'badge')
    .map(({ _id }) => _id)

  if (badgeFilters.length > 0) {
    const listToFilter = filteredPins.length > 0 ? filteredPins : allPinsInView
    const badgeFilteredList = listToFilter.filter(({ creator }) => {
      if (!creator?.badges) return
      const badges = Object.keys(creator?.badges).map((key) => key)
      return badgeFilters.some((badge) => badges?.includes(badge))
    })
    filteredPins = badgeFilteredList
  }

  return filteredPins
}
