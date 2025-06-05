import type { MapFilterOptionsList } from 'oa-shared'

const hideMembersDefault =
  import.meta.env.VITE_HIDE_MEMBER_PINS_BY_DEFAULT === 'true'

export const setDefaultPinFilters = (
  filterOptions: MapFilterOptionsList,
  hideMembers = hideMembersDefault,
) => {
  if (hideMembers) {
    const options = filterOptions.filter(
      ({ _id, filterType }) => _id !== 'member' && filterType === 'profileType',
    )
    return options
  }

  return []
}
