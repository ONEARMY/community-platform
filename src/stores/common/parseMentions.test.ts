import type { UserStore } from '../User/user.store'
import { parseMentions } from './parseMentions'

describe('parseMentions', () => {
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
      await parseMentions(
        'a simple @fish containing multiple usernames, @seconduser. A fake @user',
        mockUserStore as unknown as UserStore,
      ),
    ).toEqual({
      text: 'a simple @@{fish:FISH} containing multiple usernames, @@{seconduser:seconduser}. A fake @user',
      mentionedUsers: new Set(['FISH', 'seconduser']),
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
      await parseMentions(
        'a simple email@fish.com',
        mockUserStore as unknown as UserStore,
      ),
    ).toEqual({
      text: 'a simple email@fish.com',
      mentionedUsers: new Set([]),
    })
  })

  it('handles errors when fetching user', async () => {
    mockUserStore.getUserProfile.mockRejectedValue(new Error())

    expect(
      await parseMentions(
        'a simple email@fish.com',
        mockUserStore as unknown as UserStore,
      ),
    ).toEqual({
      text: 'a simple email@fish.com',
      mentionedUsers: new Set([]),
    })
  })
})
