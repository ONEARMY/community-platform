import { getProfileTagsForTheme } from 'src/utils/getProfileTagsForTheme'

import type { MapFilterOptionsList } from 'oa-shared'

const profileTags = getProfileTagsForTheme().map((tag) => ({
  filterType: 'profileTag',
  ...tag,
}))

export const allMapFilterOptions: MapFilterOptionsList = [
  {
    _id: 'workspace',
    filterType: 'profileType',
    label: 'Workspace',
  },
  {
    _id: 'machine-builder',
    filterType: 'profileType',
    label: 'Machine Builder',
  },
  {
    _id: 'community-builder',
    filterType: 'profileType',
    label: 'Community Point',
  },
  {
    _id: 'collection-point',
    filterType: 'profileType',
    label: 'Collection Point',
  },
  {
    _id: 'space',
    filterType: 'profileType',
    label: 'Space',
  },
  {
    _id: 'member',
    filterType: 'profileType',
    label: 'Want to get started',
  },
  {
    _id: 'verified',
    filterType: 'badge',
    label: 'Verified',
  },
  {
    _id: 'supporter',
    filterType: 'badge',
    label: 'Supporter',
  },
  ...profileTags,
]
