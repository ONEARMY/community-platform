import { describe, expect, it, vi } from 'vitest'

import { checkUserNameUnique } from './checkUserNameUnique'

import type { UserStore } from '../stores/User/user.store'

describe('checkUserNameUnique', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      getUserProfile: () => vi.fn(),
    }
  })
  const store = new mock() as UserStore

  it('user does not exist', async () => {
    vi.spyOn(store, 'getUserProfile').mockResolvedValue(undefined)

    const check = await checkUserNameUnique(store, 'testUser')

    expect(check).toBe(true)
  })

  it('user does exist', async () => {
    vi.spyOn(store, 'getUserProfile').mockResolvedValue({})

    const check = await checkUserNameUnique(store, 'testUser')

    expect(check).toBe(false)
  })
})
