import { render, screen } from '@testing-library/react'
import { factoryImage, FactoryUser } from 'src/test/factories/User'
import { afterEach, describe, it, vi } from 'vitest'

import { UserAction } from './UserAction'

const mockUseProfileStore = vi.hoisted(() => vi.fn())

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

const incompleteProfile = <>incompleteProfile</>
const loggedIn = <>LoggedIn</>
const loggedOut = <>loggedOut</>

describe('UserAction', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render the incompleteProfile component when a user is logged in but profile incomplete', async () => {
    const mockUser = FactoryUser()
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })

    render(
      <UserAction
        incompleteProfile={incompleteProfile}
        loggedIn={loggedIn}
        loggedOut={loggedOut}
      />,
    )
    await screen.findByText('incompleteProfile', { exact: false })
  })

  it('should render the loggedIn component when a user is logged in and profile complete', async () => {
    const completeUser = FactoryUser({
      about: 'about',
      type: 'member',
      photo: factoryImage,
    })
    mockUseProfileStore.mockReturnValue({
      profile: completeUser,
      update: vi.fn(),
    })

    render(
      <UserAction
        incompleteProfile={incompleteProfile}
        loggedIn={loggedIn}
        loggedOut={loggedOut}
      />,
    )
    await screen.findByText('loggedIn', { exact: false })
  })

  it('should render the loggedOut component when a user is not logged in', async () => {
    mockUseProfileStore.mockReturnValue({
      profile: null,
      update: vi.fn(),
    })
    render(<UserAction loggedIn={loggedIn} loggedOut={loggedOut} />)

    await screen.findByText('loggedOut')
  })
})
