import { render, screen } from '@testing-library/react'
import { FactoryUser } from 'src/test/factories/User'
import { describe, it, vi } from 'vitest'

import { UserAction } from './UserAction'

let mockUser = FactoryUser()

vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        authUser: mockUser,
      },
    },
  }),
}))

const loggedIn = <>LoggedIn</>
const loggedOut = <>loggedOut</>

describe('UserAction', () => {
  it('should render the loggedIn component when a user is logged in', async () => {
    render(<UserAction loggedIn={loggedIn} loggedOut={loggedOut} />)
    await screen.findByText('loggedIn', { exact: false })
  })

  it('should render the loggedOut component when a user is not logged in', async () => {
    mockUser = null as any
    render(<UserAction loggedIn={loggedIn} loggedOut={loggedOut} />)

    await screen.findByText('loggedOut')
  })
})
