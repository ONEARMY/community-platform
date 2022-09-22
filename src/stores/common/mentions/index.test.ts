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
        'a simple @fish containing multiple usernames, @seconduser. A fake @user',
        mockUserStore as unknown as UserStore,
      ),
    ).toEqual(
      'a simple @@{fish:FISH} containing multiple usernames, @@{seconduser:seconduser}. A fake @user',
    )
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
    ).toEqual('a simple email@fish.com')
  })

  it('handles errors when fetching user', async () => {
    mockUserStore.getUserProfile.mockRejectedValue(new Error())

    expect(
      await changeMentionToUserReference(
        'a simple email@fish.com',
        mockUserStore as unknown as UserStore,
      ),
    ).toEqual('a simple email@fish.com')
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
})
