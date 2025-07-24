import type { MapFilterOption } from 'oa-shared'

export const allMapFilterOptions: MapFilterOption[] = [
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
  {
    _id: 'visitors',
    filterType: 'setting',
    label: 'Open to visitors',
  },
  // TODO figure out how to add profile tags.
]
