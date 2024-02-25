jest.mock('../common/module.store')
import { UserStore } from '../stores/User/user.store'
import { checkUserNameUnique } from './checkUserNameUnique'

describe('checkUserNameUnique', async () => {
  let store

  beforeEach(() => {
    store = new UserStore({} as any)
  })

  it('user does not exist', () => {
    expect(checkUserNameUnique(store, 'testUser')).toBe(true)
  })

  await store.registerNewUser('newuser@example.com', 'password', 'testUser')

  it('user does exist', () => {
    expect(checkUserNameUnique(store, 'testUser')).toBe(false)
  })
})
