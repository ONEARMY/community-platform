import { createContext } from 'react'

import type { LatLngBounds } from 'leaflet'
import type {
  ILatLng,
  MapPin,
  ProfileBadge,
  ProfileTag,
  ProfileType,
} from 'oa-shared'

export const MapContext = createContext<{
  allPins: MapPin[] | null
  allBadges: ProfileBadge[]
  allTags: ProfileTag[]
  allProfileTypes: ProfileType[]
  allProfileSettings: string[]
  filteredPins: MapPin[]
  activeTagFilters: number[]
  activeBadgeFilters: string[]
  activeProfileTypeFilters: string[]
  activeProfileSettingFilters: string[]
  location: ILatLng
  selectedPin: MapPin | null | undefined
  loadingMessage: string
  isMobile: boolean
  boundaries: LatLngBounds | null
  toggleActiveTagFilter: (value: number) => void
  toggleActiveBadgeFilter: (value: string) => void
  toggleActiveProfileTypeFilter: (value: string) => void
  toggleActiveProfileSettingFilter: (value: string) => void
  setLocation: (value: ILatLng) => void
  selectPin: (value: MapPin | null) => void
  setIsMobile: (value: boolean) => void
  setBoundaries: (value: LatLngBounds | null) => void
} | null>(null)
