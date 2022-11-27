jest.mock('../common/module.store')
import { FactoryUser } from 'src/test/factories/User'
import type { RootStore } from '..'
import { UserStore } from './user.store'

describe('user.store', () => {
  describe('triggerNotification', () => {
    it('adds a new notification to user', async () => {
      const store = new UserStore({} as RootStore)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store.db.getWhere.mockReturnValue([FactoryUser()])

      // Act
      await store.triggerNotification(
        'howto_mention',
        'example',
        'https://example.com',
      )

      // Expect
      const [newUser] = store.db.set.mock.calls[0]
      expect(store.db.set).toBeCalledTimes(1)
      expect(newUser.notifications).toHaveLength(1)
      expect(newUser.notifications[0]).toEqual(
        expect.objectContaining({
          type: 'howto_mention',
        }),
      )
    })

    it('throws error when invalid user passed', async () => {
      const store = new UserStore({} as RootStore)

      // Act
      await expect(
        store.triggerNotification(
          'howto_mention',
          'non-existent-user',
          'https://example.com',
        ),
      ).rejects.toThrow('User not found')
    })
  })
})
