import { ProfileTypeList } from 'oa-shared'
import { describe, expect, it } from 'vitest'

import { filterPins } from './filterPins'

import type { MapPin } from 'oa-shared'

describe('filterPins', () => {
  const memberFilter = {
    _id: 'member',
    filterType: 'profileType',
    label: 'member',
  }

  const tagFilter = {
    _id: 'designer',
    filterType: 'profileTag',
    label: 'Designer',
  }

  const builderFilter = {
    _id: 'builder',
    filterType: 'profileTag',
    label: 'builder',
  }

  const workspacePin = {
    id: 1,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    administrative: '',
    country: '',
    countryCode: '',
    postcode: '',
    profileId: 1,
    profile: {
      id: 1,
      username: 'bob_the_builder',
      isVerified: true,
      lastActive: new Date(),
      countryCode: 'uk',
      displayName: 'Bob the Builder',
      isContactable: false,
      isSupporter: false,
      about: '',
      country: '',
      photo: null,
      openToVisitors: null,
      type: ProfileTypeList.WORKSPACE,
      tags: [
        {
          id: 1,
          name: 'Designer',
          createdAt: new Date(),
          profileType: 'workspace',
        },
      ],
    },
  } as MapPin

  const memberPin = {
    id: 1,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    administrative: '',
    country: '',
    countryCode: '',
    postcode: '',
    profileId: 1,
    profile: {
      id: 1,
      username: 'bob_the_member',
      isVerified: true,
      lastActive: new Date(),
      countryCode: 'uk',
      displayName: 'Bob the Member',
      isContactable: false,
      isSupporter: false,
      about: '',
      country: '',
      photo: null,
      openToVisitors: null,
      type: ProfileTypeList.MEMBER,
      tags: [
        {
          id: 1,
          name: 'Designer',
          createdAt: new Date(),
          profileType: 'member',
        },
      ],
    },
  } as MapPin

  const taggedMemberPin = {
    id: 1,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    administrative: '',
    country: '',
    countryCode: '',
    postcode: '',
    profileId: 1,
    profile: {
      id: 1,
      username: 'bob_the_tagged',
      isVerified: true,
      lastActive: new Date(),
      countryCode: 'uk',
      displayName: 'Bob the Tagged',
      isContactable: false,
      isSupporter: false,
      about: '',
      country: '',
      photo: null,
      openToVisitors: null,
      type: ProfileTypeList.MEMBER,
      tags: [
        {
          id: 1,
          name: 'Designer',
          createdAt: new Date(),
          profileType: 'member',
        },
      ],
    },
  } as MapPin

  const allPinsInView: MapPin[] = [workspacePin, memberPin, taggedMemberPin]

  it('returns all pins when no filters provided', () => {
    const activePinFilters = []

    expect(filterPins(activePinFilters, allPinsInView)).toEqual(allPinsInView)
  })

  it('returns only the correct profile type pins when filter is provided', () => {
    const activePinFilters = [memberFilter]

    expect(filterPins(activePinFilters, allPinsInView)).toEqual([
      memberPin,
      taggedMemberPin,
    ])
  })

  it('returns only the pins when profile type and tag filters are provided', () => {
    const activePinFilters = [memberFilter, tagFilter]

    expect(filterPins(activePinFilters, allPinsInView)).toEqual([
      taggedMemberPin,
    ])
  })

  it('returns an empty arry when no pins meet the filter criteria', () => {
    const activePinFilters = [builderFilter]

    expect(filterPins(activePinFilters, allPinsInView)).toEqual([])
  })
})
