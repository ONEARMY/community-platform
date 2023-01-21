import type { UserStore } from '../../User/user.store'
import {
  changeMentionToUserReference,
  changeUserReferenceToPlainText,
} from './'

describe('changeMentionToUserReference', () => {
  const mockUserStore = {
    getUserProfile: jest.fn(),
  }

  beforeEach(() => {
    mockUserStore.getUserProfile.mockClear()
  })

  it('extracts valid user names', async () => {
    mockUserStore.getUserProfile.mockImplementation(async (_authID) =>
      [
        {
          _authID: 'fish',
          userName: 'FISH',
        },
        {
          _authID: 'seconduser',
          userName: 'seconduser',
        },
      ].find((user) => user._authID === _authID),
    )

    expect(
      await changeMentionToUserReference(
        'a simple @​fish containing multiple usernames, @seconduser. One fake @user',
        mockUserStore as unknown as UserStore,
      ),
    ).toEqual({
      text: 'a simple @@{fish:FISH} containing multiple usernames, @@{seconduser:seconduser}. One fake @​user',
      mentionedUsers: ['FISH', 'seconduser'],
    })
  })

  it('extracts valid user names', async () => {
    mockUserStore.getUserProfile.mockImplementation(async (_authID) =>
      [
        {
          _authID: 'fish',
          userName: 'FISH',
        },
        {
          _authID: 'seconduser',
          userName: 'seconduser',
        },
      ].find((user) => user._authID === _authID),
    )

    expect(
      await changeMentionToUserReference(
        'a simple email@fish.com',
        mockUserStore as unknown as UserStore,
      ),
    ).toEqual({
      text: 'a simple email@fish.com',
      mentionedUsers: [],
    })
  })

  it('handles errors when fetching user', async () => {
    mockUserStore.getUserProfile.mockRejectedValue(new Error())

    expect(
      await changeMentionToUserReference(
        'a simple email@fish.com',
        mockUserStore as unknown as UserStore,
      ),
    ).toEqual({
      text: 'a simple email@fish.com',
      mentionedUsers: [],
    })
  })
})

describe('changeUserReferenceToPlainText', () => {
  it('converts valid userreference to plain text', () => {
    expect(changeUserReferenceToPlainText('@@{authId0021:username}')).toBe(
      '@username',
    )
  })

  it('converts multiple userreferences to plain text', () => {
    expect(
      changeUserReferenceToPlainText(
        '@@{authId0021:username} @@{authId:username2}',
      ),
    ).toBe('@username @username2')
  })

  it('converts multiple userreferences to plain text', () => {
    expect(
      changeUserReferenceToPlainText(
        '@@{authId0021:username-one} @@{authId:username-with-trailing-slash-} @@{authId:-username-with-leading-slash} @@{authId:username-multiple---slashes} @@{authId:username_with_underscores}',
      ),
    ).toBe(
      '@username-one @username-with-trailing-slash- @-username-with-leading-slash @username-multiple---slashes @username_with_underscores',
    )
  })

  it('turns `@plain-text` into format that will not be autolinked', () => {
    expect(changeUserReferenceToPlainText('@abc')).toBe('@​abc')
  })
})
