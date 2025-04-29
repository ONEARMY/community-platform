import type { IMapPin, MapFilterOptionsList } from 'oa-shared'

export const filterPins = (
  activePinFilters: MapFilterOptionsList,
  pins: IMapPin[],
): IMapPin[] => {
  if (activePinFilters.length === 0) {
    return pins
  }
  const activeFilterIdsForType = (type: string) =>
    activePinFilters
      .filter(({ filterType }) => filterType === type)
      .map(({ _id }) => _id)

  const typeFilters = activeFilterIdsForType('profileType')

  let filteredPins: IMapPin[] = [...pins]

  if (typeFilters.length > 0) {
    const profileTypeFilteredList = pins.filter(
      ({ creator }) =>
        creator?.profileType && typeFilters.includes(creator?.profileType),
    )
    filteredPins = profileTypeFilteredList
  }

  const tagFilters = activeFilterIdsForType('profileTag')

  if (tagFilters.length > 0) {
    const tagFilteredList = filteredPins.filter(({ creator }) => {
      const tagIds = creator?.tags?.map(({ _id }) => _id)
      return tagFilters.some((tagId) => tagIds?.includes(tagId))
    })
    filteredPins = tagFilteredList
  }

  const badgeFilters = activeFilterIdsForType('badge')

  if (badgeFilters.length > 0) {
    const badgeFilteredList = filteredPins.filter(({ creator }) => {
      if (!creator?.badges) return false
      const badges = Object.keys(creator?.badges).filter(
        (key) => creator?.badges && creator.badges[key],
      )
      return badgeFilters.filter((badge) => badges.includes(badge)).length > 0
    })
    filteredPins = badgeFilteredList
  }

  const settingFilters = activeFilterIdsForType('setting')

  if (settingFilters.length > 0) {
    // Right now visitor filter is only setting filter. If N>1 this should be smarter.
    filteredPins = filteredPins.filter(
      ({ creator }) =>
        creator?.openToVisitors && creator.openToVisitors.policy !== 'closed',
    )
  }

  return filteredPins
}
