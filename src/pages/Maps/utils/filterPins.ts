import type { IMapPin, MapFilterOptionsList } from 'oa-shared'

export const filterPins = (
  activePinFilters: MapFilterOptionsList,
  pins: IMapPin[],
): IMapPin[] => {
  if (activePinFilters.length === 0) {
    return pins
  }
  const typeFilters = activePinFilters
    .filter(({ filterType }) => filterType === 'profileType')
    .map(({ _id }) => _id)

  let filteredPins: IMapPin[] = []

  if (typeFilters.length > 0) {
    const profileTypeFilteredList = pins.filter(
      ({ creator }) =>
        creator?.profileType && typeFilters.includes(creator?.profileType),
    )
    filteredPins.push(...profileTypeFilteredList)
  }

  const tagFilters = activePinFilters
    .filter(({ filterType }) => filterType === 'profileTag')
    .map(({ _id }) => _id)

  if (tagFilters.length > 0) {
    const listToFilter = filteredPins.length > 0 ? filteredPins : pins
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
    const listToFilter = filteredPins.length > 0 ? filteredPins : pins
    const badgeFilteredList = listToFilter.filter(({ creator }) => {
      if (!creator?.badges) return
      const badges = Object.keys(creator?.badges).filter(
        (key) => creator?.badges && creator.badges[key],
      )
      return badgeFilters.filter((badge) => badges.includes(badge)).length > 0
    })
    filteredPins = badgeFilteredList
  }

  return filteredPins
}
