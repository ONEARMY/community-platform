import {
  hasDetailsChanged,
  hasDetailsForCommentsChanged,
  hasDetailsForMapPinChanged,
  hasLocationDetailsChanged,
  hasUserImageChanged,
  hasUserTagsChanged,
} from './utils'

import type { IUploadedFileMeta } from 'oa-shared'
import type { IUserDB } from 'oa-shared/models/user'

const unimportantUserDetails = {
  _authID: '00',
  _id: 'unchangeable',
  _created: '',
  _deleted: false,
  userName: 'unchangeable',
  verified: false,
  coverImages: [],
  links: [],
}

describe('hasDetailsChanged', () => {
  it("returns false for every field that's the same", () => {
    const user = {
      _lastActive: 'same',
      about: 'about',
      displayName: 'same',
      isContactableByPublic: true,
      profileType: 'member',
      userImage: {
        downloadUrl: 'https://more.same/image.jpg',
      } as IUploadedFileMeta,
      badges: {
        verified: true,
        supporter: false,
      },
      tags: {
        hguowewer: true,
        '76khbrw': false,
      },
      ...unimportantUserDetails,
    } as IUserDB

    expect(hasDetailsChanged(user, user)).toEqual([false, false, false, false])
  })

  it("returns true for every field that's different", () => {
    const prevUser = {
      _lastActive: 'yesterday',
      about: 'Old about',
      displayName: 'old',
      profileType: 'member',
      workspaceType: null,
      userImage: {
        downloadUrl: 'https://more.old/image.jpg',
      } as IUploadedFileMeta,
      badges: {
        verified: true,
        supporter: true,
      },
      tags: {
        hguowewer: true,
      },
      ...unimportantUserDetails,
    } as IUserDB

    const user = {
      _lastActive: 'today',
      about: 'New about description.',
      displayName: 'new',
      profileType: 'space',
      workspaceType: 'extrusion',
      userImage: {
        downloadUrl: 'https://more.new/image.jpg',
      } as IUploadedFileMeta,
      badges: {
        verified: false,
        supporter: false,
      },
      tags: {
        hguowewer: true,
        '76khbrw': true,
      },
      ...unimportantUserDetails,
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

describe('hasUserTagsChanged', () => {
  it('returns false when nothing has changed', () => {
    const user = {
      displayName: 'displayName',
      profileType: 'member',
      tags: {
        gyi: false,
        bnhjo: true,
      },
      ...unimportantUserDetails,
    } as IUserDB
    expect(hasUserTagsChanged(user, user)).toEqual(false)
  })

  it('returns true when a tag is added', () => {
    const prevUser = {
      displayName: 'displayName',
      profileType: 'member',
      tags: {
        gyi: false,
      },
      ...unimportantUserDetails,
    } as IUserDB

    const user = {
      displayName: 'displayName',
      profileType: 'member',
      tags: {
        gyi: false,
        bnhjo: true,
      },
      ...unimportantUserDetails,
    } as IUserDB
    expect(hasUserTagsChanged(prevUser, user)).toEqual(true)
  })

  it('returns true when a tag is changed', () => {
    const prevUser = {
      displayName: 'displayName',
      profileType: 'member',
      tags: {
        gyi: false,
      },
      ...unimportantUserDetails,
    } as IUserDB

    const user = {
      displayName: 'displayName',
      profileType: 'member',
      tags: {
        gyi: true,
      },
      ...unimportantUserDetails,
    } as IUserDB
    expect(hasUserTagsChanged(prevUser, user)).toEqual(true)
  })
})
