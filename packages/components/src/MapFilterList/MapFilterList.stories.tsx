import { MapFilterList } from './MapFilterList'

import type { Meta, StoryFn } from '@storybook/react'
import type { MapFilterOptionsList } from 'oa-shared'

export default {
  title: 'Components/MapFilterList',
  component: MapFilterList,
} as Meta<typeof MapFilterList>

// Copied from src/pages/Maps/Content/MapView/allMapFilterOptions.ts
const availableFilters: MapFilterOptionsList = [
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
  {
    filterType: 'workspaceType',
    label: 'Shredder',
    slug: 'shredder',
  },
  {
    filterType: 'workspaceType',
    label: 'Sheetpress',
    slug: 'sheetpress',
  },
  {
    filterType: 'workspaceType',
    label: 'Extrusion',
    slug: 'extrusion',
  },
  {
    filterType: 'workspaceType',
    label: 'Injection',
    slug: 'injection',
  },
  {
    filterType: 'workspaceType',
    label: 'Mix',
    slug: 'mix',
  },
]

export const Default: StoryFn<typeof MapFilterList> = () => {
  const activeFilters = [] as MapFilterOptionsList
  const onClose = () => {
    null
  }
  const onFilterChange = () => {
    null
  }

  return (
    <MapFilterList
      activeFilters={activeFilters}
      availableFilters={availableFilters}
      onFilterChange={onFilterChange}
      onClose={onClose}
    />
  )
}
