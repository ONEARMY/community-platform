import type { MapFilterOption, MapPin } from 'oa-shared'

export const filterPins = (
  activePinFilters: MapFilterOption[],
  pins: MapPin[],
): MapPin[] => {
  if (activePinFilters.length === 0) {
    return pins
  }
  const activeFilterIdsForType = (type: string) =>
    activePinFilters
      .filter(({ filterType }) => filterType === type)
      .map(({ _id }) => _id)

  const typeFilters = activeFilterIdsForType('profileType')

  let filteredPins: MapPin[] = [...pins]

  if (typeFilters.length > 0) {
    const profileTypeFilteredList = pins.filter(
      ({ profile }) => profile?.type && typeFilters.includes(profile?.type),
    )
    filteredPins = profileTypeFilteredList
  }

  const tagFilters = activeFilterIdsForType('profileTag')

  if (tagFilters.length > 0) {
    filteredPins = filteredPins.filter(({ profile }) => {
      const tags = profile?.tags?.map(({ name }) => name)
      return tagFilters.some((tagId) => tags?.includes(tagId))
    })
  }

  const badgeFilters = activeFilterIdsForType('badge')

  if (badgeFilters.length > 0) {
    filteredPins = filteredPins.filter(({ profile }) => {
      if (!profile?.badges) return false
      const badges = Object.keys(creator?.badges).filter(
        (key) => creator?.badges && creator.badges[key],
      )
      return badgeFilters.filter((badge) => badges.includes(badge)).length > 0
    })
  }

  const settingFilters = activeFilterIdsForType('setting')

  if (settingFilters.length > 0) {
    // Right now visitor filter is only setting filter. If N>1 this should be smarter.
    filteredPins = filteredPins.filter(
      ({ profile }) =>
        profile?.openToVisitors && profile.openToVisitors.policy !== 'closed',
    )
  }

  return filteredPins
}
