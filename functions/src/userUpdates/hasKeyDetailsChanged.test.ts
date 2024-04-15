import { hasKeyDetailsChanged } from './hasKeyDetailsChanged'

import type { IUserDB } from '../../../src/models'

describe('hasKeyDetailsChanged', () => {
  it('returns true when details have changed', () => {
    const prevUser = {
      displayName: 'old name',
      location: { countryCode: 'USA' },
    } as IUserDB
    const user = {
      displayName: 'new name',
      location: { countryCode: 'USA' },
      badges: { verified: true },
    } as IUserDB

    expect(hasKeyDetailsChanged(prevUser, user)).toEqual(true)
  })

  it('returns false when details are the same', () => {
    const prevUser = {
      displayName: 'same name',
      location: { countryCode: 'USA' },
      badges: {
        verified: true,
        supporter: false,
      },
    } as IUserDB
    const user = {
      displayName: 'same name',
      location: { countryCode: 'USA' },
      badges: {
        verified: true,
        supporter: false,
      },
    } as IUserDB

    expect(hasKeyDetailsChanged(prevUser, user)).toEqual(false)
  })
})
