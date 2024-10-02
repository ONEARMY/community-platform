import { WORKSPACE_TYPES } from 'src/pages/UserSettings/content/sections/Workspace.section'

import type { MapFilterOptionsList } from 'oa-shared'

const workspaceTypes = WORKSPACE_TYPES.map(
  ({ textLabel, label, imageSrc }) => ({
    filterType: 'workspaceType',
    label: textLabel,
    slug: label,
    imageSrc,
  }),
)

export const allMapFilterOptions: MapFilterOptionsList = [
  {
    filterType: 'profileType',
    label: 'Workspace',
    slug: 'workspace',
  },
  {
    filterType: 'profileType',
    label: 'Machine Builder',
    slug: 'machine-builder',
  },
  {
    filterType: 'profileType',
    label: 'Community Point',
    slug: 'community-builder',
  },
  {
    filterType: 'profileType',
    label: 'Collection Point',
    slug: 'collection-point',
  },
  {
    filterType: 'profileType',
    label: 'Space',
    slug: 'space',
  },
  {
    filterType: 'profileType',
    label: 'Want to get started',
    slug: 'member',
  },
  ...workspaceTypes,
]
