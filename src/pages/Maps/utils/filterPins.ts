import { latLongFilter } from './filterLatLong'

import type { LatLngBounds } from 'leaflet'
import type { MapPin } from 'oa-shared'

export const filterPins = (
  allPins: MapPin[],
  filters: {
    tags?: number[]
    types?: string[]
    badges?: string[]
    settings?: string[]
    boundaries?: LatLngBounds
  },
): MapPin[] => {
  if (!allPins?.length) {
    return []
  }
  const { tags, types, badges, settings, boundaries } = filters

  let filteredPins = structuredClone(allPins)

  if (tags?.length) {
    filteredPins = filteredPins.filter((x) =>
      x.profile?.tags?.some((tag) => tags.includes(tag.id)),
    )
  }

  if (types?.length) {
    filteredPins = filteredPins.filter(
      (x) => x.profile?.type?.name && types.includes(x.profile?.type?.name),
    )
  }

  if (badges?.length) {
    filteredPins = filteredPins.filter((x) =>
      x.profile?.badges?.some((badge) => badges.includes(badge.name)),
    )
  }

  if (settings?.length) {
    // Right now visitor filter is only setting filter. This should be smarter.
    filteredPins = filteredPins.filter(
      (x) => x.profile?.visitorPolicy?.policy === 'open',
    )
  }

  if (boundaries) {
    filteredPins = latLongFilter(
      {
        _northEast: boundaries.getNorthEast(),
        _southWest: boundaries.getSouthWest(),
      },
      filteredPins,
    )
  }

  return filteredPins
}
