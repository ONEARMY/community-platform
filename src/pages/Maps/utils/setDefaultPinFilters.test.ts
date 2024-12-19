import { describe, expect, it } from 'vitest'

import { setDefaultPinFilters } from './setDefaultPinFilters'

describe('setDefaultPinFilters', () => {
  const filterOptions = [
    {
      _id: 'workspace',
      filterType: 'profileType',
      label: 'Workspace',
    },
    {
      _id: 'member',
      filterType: 'profileType',
      label: 'Member',
    },
  ]

  it('returns nothing when hideMembers is false', () => {
    expect(setDefaultPinFilters(filterOptions, false)).toEqual([])
  })

  it('returns non-member options when hideMembers is true', () => {
    expect(setDefaultPinFilters(filterOptions, true)).toEqual([
      filterOptions[0],
    ])
  })
})
