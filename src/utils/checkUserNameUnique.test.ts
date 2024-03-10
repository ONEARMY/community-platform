import { checkUserNameUnique } from './checkUserNameUnique'

import type { UserStore } from '../stores/User/user.store'

describe('checkUserNameUnique', () => {
  const mock = jest.fn().mockImplementation(() => {
    return {
      getUserProfile: () => jest.fn(),
    }
  })
  const store = new mock() as UserStore

  it('user does not exist', async () => {
    jest.spyOn(store, 'getUserProfile').mockResolvedValue(undefined)

    const check = await checkUserNameUnique(store, 'testUser')

    expect(check).toBe(true)
  })

  it('user does exist', async () => {
    jest.spyOn(store, 'getUserProfile').mockResolvedValue({})

    const check = await checkUserNameUnique(store, 'testUser')

    expect(check).toBe(false)
  })
})
