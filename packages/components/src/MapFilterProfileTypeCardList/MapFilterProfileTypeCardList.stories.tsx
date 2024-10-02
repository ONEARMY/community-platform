import { useState } from 'react'

import { MapFilterProfileTypeCardList } from './MapFilterProfileTypeCardList'

import type { Meta, StoryFn } from '@storybook/react'
import type {
  MapFilterOption,
  MapFilterOptionsList,
  ProfileTypeName,
} from 'oa-shared'

export default {
  title: 'Map/FilterList',
  component: MapFilterProfileTypeCardList,
} as Meta<typeof MapFilterProfileTypeCardList>

const availableFilters = [
  {
    label: 'Workspace',
    slug: 'workspace' as ProfileTypeName,
    filterType: 'ProfileType',
  },
  {
    label: 'Machine Builder',
    slug: 'machine-builder' as ProfileTypeName,
    filterType: 'ProfileType',
  },
  {
    label: 'Collection Point',
    slug: 'collection-point' as ProfileTypeName,
    filterType: 'ProfileType',
  },
  {
    label: 'Want to get started',
    slug: 'member' as ProfileTypeName,
    filterType: 'ProfileType',
  },
]

export const Basic: StoryFn<typeof MapFilterProfileTypeCardList> = () => {
  const [activeFilters, setActiveFilters] = useState<MapFilterOptionsList>([])

  const onFilterChange = (option: MapFilterOption) => {
    const isFilterPresent = !!availableFilters.find(
      (pinFilter) => pinFilter.slug == option.slug,
    )
    if (isFilterPresent) {
      return setActiveFilters((filter) =>
        filter.filter((existingOption) => existingOption !== option),
      )
    }
    return setActiveFilters((existingOptions) => [...existingOptions, option])
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <MapFilterProfileTypeCardList
        activeFilters={activeFilters}
        availableFilters={availableFilters}
        onFilterChange={onFilterChange}
      />
    </div>
  )
}

export const OnlyOne: StoryFn<typeof MapFilterProfileTypeCardList> = () => {
  const [activeFilters, setActiveFilters] = useState<MapFilterOptionsList>([])

  const onFilterChange = (option: MapFilterOption) => {
    const isFilterPresent = !!availableFilters.find(
      (pinFilter) => pinFilter.slug == option.slug,
    )
    if (isFilterPresent) {
      return setActiveFilters((filter) =>
        filter.filter((existingOption) => existingOption !== option),
      )
    }
    return setActiveFilters((existingOptions) => [...existingOptions, option])
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <MapFilterProfileTypeCardList
        activeFilters={activeFilters}
        availableFilters={[availableFilters[0]]}
        onFilterChange={onFilterChange}
      />
      (Shouldn't see anything, only renders for two or more)
    </div>
  )
}

export const OnlyTwo: StoryFn<typeof MapFilterProfileTypeCardList> = () => {
  const [activeFilters, setActiveFilters] = useState<MapFilterOptionsList>([])

  const onFilterChange = (option: MapFilterOption) => {
    const isFilterPresent = !!availableFilters.find(
      (pinFilter) => pinFilter.slug == option.slug,
    )
    if (isFilterPresent) {
      return setActiveFilters((filter) =>
        filter.filter((existingOption) => existingOption !== option),
      )
    }
    return setActiveFilters((existingOptions) => [...existingOptions, option])
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <MapFilterProfileTypeCardList
        activeFilters={activeFilters}
        availableFilters={[availableFilters[0], availableFilters[1]]}
        onFilterChange={onFilterChange}
      />
      (No buttons rendered)
    </div>
  )
}
