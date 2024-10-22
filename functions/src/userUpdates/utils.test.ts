import {
  hasDetailsChanged,
  hasDetailsForCommentsChanged,
  hasDetailsForMapPinChanged,
  hasLocationDetailsChanged,
  hasUserImageChanged,
} from './utils'

import type { IUserDB } from 'oa-shared/models/user'

describe('hasDetailsChanged', () => {
  it("returns false for every field that's the same", () => {
    const user = {
      displayName: 'same',
      userImage: {
        downloadUrl: 'https://more.same/image.jpg',
      },
      badges: {
        verified: true,
        supporter: false,
      },
    } as IUserDB

    expect(hasDetailsChanged(user, user)).toEqual([false, false, false, false])
  })

  it("returns true for every field that's different", () => {
    const prevUser = {
      displayName: 'old',
      userImage: {
        downloadUrl: 'https://more.old/image.jpg',
      },
      badges: {
        verified: true,
        supporter: true,
      },
    } as IUserDB

    const user = {
      displayName: 'new',
      userImage: {
        downloadUrl: 'https://more.new/image.jpg',
      },
      badges: {
        verified: false,
        supporter: false,
      },
    } as IUserDB

    expect(hasDetailsChanged(prevUser, user)).toEqual([true, true, true, true])
  })
})

describe('hasLocationDetailsChanged', () => {
  it('returns true when details have changed', () => {
    const prevUser = {
      location: { countryCode: 'mw' },
      country: 'mw',
    } as IUserDB

    const user = {
      location: { countryCode: 'uk' },
      country: 'uk',
    } as IUserDB
    expect(hasLocationDetailsChanged(prevUser, user)).toEqual([true, true])
  })

  it('returns false when details are the same', () => {
    const user = {
      location: { countryCode: 'uk' },
      country: 'uk',
    } as IUserDB
    expect(hasLocationDetailsChanged(user, user)).toEqual([false, false])
  })
})

describe('hasDetailsForCommentsChanged', () => {
  it('returns true when details have changed', () => {
    const prevUser = {
      displayName: 'old name',
      location: { countryCode: 'USA' },
    } as IUserDB
    const user = {
      displayName: 'new name',
      userImage: {
        downloadUrl: 'http//etc.',
      },
      location: { countryCode: 'USA' },
      badges: { verified: true },
    } as IUserDB

    expect(hasDetailsForCommentsChanged(prevUser, user)).toEqual(true)
  })

  it('returns false when details are the same', () => {
    const user = {
      displayName: 'same name',
      location: { countryCode: 'USA' },
      userImage: {
        downloadUrl: 'http://etc.',
      },

      badges: {
        verified: true,
        supporter: false,
      },
    } as IUserDB

    expect(hasDetailsForCommentsChanged(user, user)).toEqual(false)
  })
})

describe('hasDetailsForMapPinChanged', () => {
  it('returns true when details have changed', () => {
    const prevUser = {
      _lastActive: 'yesterday',
      about: 'Old description',
      displayName: 'id_name',
      isContactableByPublic: true,
      profileType: 'member',
      workspaceType: null,
    } as IUserDB
    const user = {
      _authID: '',
      _lastActive: 'today',
      about: 'Super new description',
      coverImages: [],
      displayName: 'id name',
      isContactableByPublic: false,
      links: [],
      profileType: 'workspace',
      workspaceType: 'shredder',
      userName: 'idname',
      verified: false,
    } as IUserDB

    expect(hasDetailsForMapPinChanged(prevUser, user)).toEqual(true)
  })

  it('returns false when details are the same', () => {
    const user = {
      _authID: '',
      _lastActive: 'today',
      about: 'Super new description',
      coverImages: [],
      displayName: 'id name',
      isContactableByPublic: false,
      profileType: 'workspace',
      workspaceType: 'shredder',
      userName: 'idname',
      verified: false,
    } as IUserDB

    expect(hasDetailsForMapPinChanged(user, user)).toEqual(false)
  })
})

describe('hasUserImageChanged', () => {
  it('returns false when userImage array is missing from both', () => {
    const user = {} as IUserDB
    expect(hasUserImageChanged(user, user)).toEqual(false)
  })

  it('returns false when userImage is empty for both', () => {
    const user = {
      coverImages: {},
    } as IUserDB
    expect(hasUserImageChanged(user, user)).toEqual(false)
  })

  it('returns false when userImage is the same for both', () => {
    const user = {
      userImage: { downloadUrl: 'same' },
    } as IUserDB
    expect(hasUserImageChanged(user, user)).toEqual(false)
  })

  it('returns true when userImage is different', () => {
    const prevUser = { userImage: { downloadUrl: 'old' } } as IUserDB
    const user = { userImage: { downloadUrl: 'new' } } as IUserDB

    expect(hasUserImageChanged(prevUser, user)).toEqual(true)
  })

  it('returns true when userImage goes from populated to not', () => {
    const prevUser = { userImage: { downloadUrl: 'old' } } as IUserDB
    const user = { userImage: null } as IUserDB

    expect(hasUserImageChanged(prevUser, user)).toEqual(true)
  })

  it('returns true when userImage goes from empty to populated', () => {
    const prevUser = { userImage: null } as IUserDB
    const user = { userImage: { downloadUrl: 'new' } } as IUserDB

    expect(hasUserImageChanged(prevUser, user)).toEqual(true)
  })
})
