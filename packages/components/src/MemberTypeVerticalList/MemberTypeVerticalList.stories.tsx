import { useState } from 'react'

import { MemberTypeVerticalList } from './MemberTypeVerticalList.client'

import type { Meta, StoryFn } from '@storybook/react-vite'
import type { MapFilterOption, MapFilterOptionsList } from 'oa-shared'

export default {
  title: 'Map/MemberTypeVerticalList',
  component: MemberTypeVerticalList,
} as Meta<typeof MemberTypeVerticalList>

const availableFilters: MapFilterOption[] = [
  {
    label: 'Workspace',
    _id: 'workspace',
    filterType: 'profileType',
  },
  {
    label: 'Machine Builder',
    _id: 'machine-builder',
    filterType: 'profileType',
  },
  {
    label: 'Community Builder',
    _id: 'community-builder',
    filterType: 'profileType',
  },
  {
    label: 'Collection Point',
    _id: 'collection-point',
    filterType: 'profileType',
  },
  {
    label: 'Want to get started',
    _id: 'member',
    filterType: 'profileType',
  },
  {
    label: 'Generic Without Icon',
    _id: 'none',
    filterType: 'profileType',
  },
]

export const Basic: StoryFn<typeof MemberTypeVerticalList> = () => {
  const [activeFilters, setActiveFilters] = useState<MapFilterOptionsList>([])

  const onFilterChange = (option: MapFilterOption) => {
    const isFilterPresent = !!availableFilters.find(
      (pinFilter) => pinFilter._id == option._id,
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
      <MemberTypeVerticalList
        activeFilters={activeFilters}
        availableFilters={availableFilters}
        onFilterChange={onFilterChange}
      />
    </div>
  )
}

export const OnlyOne: StoryFn<typeof MemberTypeVerticalList> = () => {
  const [activeFilters, setActiveFilters] = useState<MapFilterOptionsList>([])

  const onFilterChange = (option: MapFilterOption) => {
    const isFilterPresent = !!availableFilters.find(
      (pinFilter) => pinFilter._id == option._id,
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
      <MemberTypeVerticalList
        activeFilters={activeFilters}
        availableFilters={[availableFilters[0]]}
        onFilterChange={onFilterChange}
      />
      (Shouldn't see anything, only renders for two or more)
    </div>
  )
}
