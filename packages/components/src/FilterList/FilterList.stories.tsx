import { useState } from 'react'

import { FilterList } from './FilterList'

import type { Meta, StoryFn } from '@storybook/react'
import type { ProfileTypeName } from 'oa-shared'

export default {
  title: 'Map/FilterList',
  component: FilterList,
} as Meta<typeof FilterList>

const availableFilters = [
  {
    label: 'Workspace',
    type: 'workspace' as ProfileTypeName,
  },
  {
    label: 'Machine Builder',
    type: 'machine-builder' as ProfileTypeName,
  },
  {
    label: 'Collection Point',
    type: 'collection-point' as ProfileTypeName,
  },
  {
    label: 'Want to get started',
    type: 'member' as ProfileTypeName,
  },
]

export const Basic: StoryFn<typeof FilterList> = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const onFilterChange = (label: string) => {
    const filter = label.toLowerCase()
    const isFilterPresent = !!activeFilters.find(
      (existing) => existing === filter,
    )
    if (isFilterPresent) {
      return setActiveFilters(activeFilters.filter((f) => f !== filter))
    }
    return setActiveFilters((existing) => [...existing, filter])
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <FilterList
        activeFilters={activeFilters}
        availableFilters={availableFilters}
        onFilterChange={onFilterChange}
      />
    </div>
  )
}

export const OnlyOne: StoryFn<typeof FilterList> = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const onFilterChange = (label: string) => {
    const filter = label.toLowerCase()
    const isFilterPresent = !!activeFilters.find(
      (existing) => existing === filter,
    )
    if (isFilterPresent) {
      return setActiveFilters(activeFilters.filter((f) => f !== filter))
    }
    return setActiveFilters((existing) => [...existing, filter])
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <FilterList
        activeFilters={activeFilters}
        availableFilters={[availableFilters[0]]}
        onFilterChange={onFilterChange}
      />
      (Shouldn't see anything, only renders for two or more)
    </div>
  )
}

export const OnlyTwo: StoryFn<typeof FilterList> = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const onFilterChange = (label: string) => {
    const filter = label.toLowerCase()
    const isFilterPresent = !!activeFilters.find(
      (existing) => existing === filter,
    )
    if (isFilterPresent) {
      return setActiveFilters(activeFilters.filter((f) => f !== filter))
    }
    return setActiveFilters((existing) => [...existing, filter])
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <FilterList
        activeFilters={activeFilters}
        availableFilters={[availableFilters[0], availableFilters[1]]}
        onFilterChange={onFilterChange}
      />
      (No buttons rendered)
    </div>
  )
}
