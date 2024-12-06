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
    _id: 'shredder',
    filterType: 'workspaceType',
    label: 'Shredder',
  },
  {
    _id: 'sheetpress',
    filterType: 'workspaceType',
    label: 'Sheetpress',
  },
  {
    _id: 'extrusion',
    filterType: 'workspaceType',
    label: 'Extrusion',
  },
  {
    _id: 'injection',
    filterType: 'workspaceType',
    label: 'Injection',
  },
  {
    _id: 'mix',
    filterType: 'workspaceType',
    label: 'Mix',
  },
  {
    _id: 'tag1',
    filterType: 'profileTag',
    label: 'Tag 1',
  },
  {
    _id: 'tag2',
    filterType: 'profileTag',
    label: 'Tag 2',
  },
  {
    _id: 'tag3',
    filterType: 'profileTag',
    label: 'Tag 3',
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
      pinCount={7}
    />
  )
}
