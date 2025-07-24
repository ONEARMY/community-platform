import { VITE_HIDE_MEMBER_PINS_BY_DEFAULT } from 'src/config/config'

import type { MapFilterOption } from 'oa-shared'

const hideMembersDefault = VITE_HIDE_MEMBER_PINS_BY_DEFAULT === 'true'

export const setDefaultPinFilters = (
  filterOptions: MapFilterOption[],
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
