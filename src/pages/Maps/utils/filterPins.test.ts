import { ProfileTypeList } from 'oa-shared'
import { describe, expect, it } from 'vitest'

import { filterPins } from './filterPins'

import type { MapPin } from 'oa-shared'

describe('filterPins', () => {
  const workspacePin: MapPin = {
    id: 1,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    name: '',
    postCode: '',
    administrative: '',
    country: '',
    countryCode: '',
    profileId: 1,
    profile: {
      id: 1,
      username: 'bob_the_builder',
      lastActive: new Date(),
      country: 'uk',
      displayName: 'Bob the Builder',
      isContactable: false,
      visitorPolicy: null,
      about: '',
      photo: null,
      type: ProfileTypeList.WORKSPACE,
      badges: [
        {
          id: 1,
          name: 'verified',
          displayName: 'Verified',
          imageUrl: '',
        },
      ],
      tags: [
        {
          id: 1,
          name: 'Designer',
          createdAt: new Date(),
          profileType: 'workspace',
        },
      ],
    },
  }

  const memberPin = {
    id: 2,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    name: '',
    postCode: '',
    administrative: '',
    country: '',
    countryCode: '',
    postcode: '',
    profileId: 2,
    profile: {
      id: 2,
      username: 'bob_the_member',
      lastActive: new Date(),
      countryCode: 'uk',
      displayName: 'Bob the Member',
      isContactable: false,
      about: '',
      country: '',
      visitorPolicy: null,
      photo: null,
      openToVisitors: null,
      type: ProfileTypeList.MEMBER,
      badges: [
        {
          id: 1,
          name: 'verified',
          displayName: 'Verified',
          imageUrl: '',
        },
      ],
    },
  } as MapPin

  const taggedMemberPin = {
    id: 3,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    administrative: '',
    name: '',
    postCode: '',
    moderationFeedback: '',
    country: '',
    countryCode: '',
    postcode: '',
    profileId: 3,
    profile: {
      id: 3,
      username: 'bob_the_tagged',
      lastActive: new Date(),
      countryCode: 'uk',
      displayName: 'Bob the Tagged',
      isContactable: false,
      about: '',
      country: '',
      photo: null,
      openToVisitors: null,
      type: ProfileTypeList.MEMBER,
      visitorPolicy: null,
      badges: [
        {
          id: 1,
          name: 'verified',
          displayName: 'Verified',
          imageUrl: '',
        },
      ],
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
    expect(filterPins(allPinsInView, {})).toEqual(allPinsInView)
  })

  it('returns only the correct profile type pins when filter is provided', () => {
    const filtered = filterPins(allPinsInView, { types: ['member'] })
    expect(filtered.map((x) => x.id)).toEqual([
      memberPin.id,
      taggedMemberPin.id,
    ])
  })

  it('returns only the pins when profile type and tag filters are provided', () => {
    const filtered = filterPins(allPinsInView, {
      types: ['member'],
      tags: [1],
    })
    expect(filtered.map((x) => x.id)).toEqual([taggedMemberPin.id])
  })

  it('returns an empty arry when no pins meet the filter criteria', () => {
    const filtered = filterPins(allPinsInView, {
      tags: [55],
    })
    expect(filtered).toEqual([])
  })
})
