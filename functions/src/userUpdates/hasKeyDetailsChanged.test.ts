import {
  hasCoverImagesChanged,
  hasKeyDetailsChanged,
} from './hasKeyDetailsChanged'

import type { IUserDB } from '../../../src/models'

describe('hasKeyDetailsChanged', () => {
  it('returns true when details have changed', () => {
    const prevUser = {
      displayName: 'old name',
      location: { countryCode: 'USA' },
    } as IUserDB
    const user = {
      displayName: 'new name',
      coverImages: [
        {
          downloadUrl: 'http//etc.',
        },
      ],
      location: { countryCode: 'USA' },
      badges: { verified: true },
    } as IUserDB

    expect(hasKeyDetailsChanged(prevUser, user)).toEqual(true)
  })

  it('returns false when details are the same', () => {
    const user = {
      displayName: 'same name',
      location: { countryCode: 'USA' },
      coverImages: [
        {
          downloadUrl: 'http://etc.',
        },
      ],
      badges: {
        verified: true,
        supporter: false,
      },
    } as IUserDB

    expect(hasKeyDetailsChanged(user, user)).toEqual(false)
  })
})

describe('hasKeyDetailsChanged', () => {
  it('returns false when coverImage array is missing from both', () => {
    const user = {} as IUserDB
    expect(hasCoverImagesChanged(user, user)).toEqual(false)
  })

  it('returns false when coverImage array is empty for both', () => {
    const user = {
      coverImages: [],
    } as IUserDB
    expect(hasCoverImagesChanged(user, user)).toEqual(false)
  })

  it('returns false when coverImage first item is the same for both', () => {
    const user = {
      coverImages: [{ downloadUrl: 'same' }],
    } as IUserDB
    expect(hasCoverImagesChanged(user, user)).toEqual(false)
  })
})
