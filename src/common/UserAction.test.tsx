import { render, screen } from '@testing-library/react'
import { factoryImage, FactoryUser } from 'src/test/factories/User'
import { afterEach, describe, it, vi } from 'vitest'

import { UserAction } from './UserAction'

import type { ExternalLinkLabel, IUserDB } from 'oa-shared'

let mockUser: IUserDB = FactoryUser()
vi.mock('src/stores/User/profile.store', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useProfileStore: () => ({
    profile: mockUser,
  }),
}))

const incompleteProfile = <>incompleteProfile</>
const loggedIn = <>LoggedIn</>
const loggedOut = <>loggedOut</>

describe('UserAction', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render the incompleteProfile component when a user is logged in but profile incomplete', async () => {
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
      links: [{ label: 'website' as ExternalLinkLabel, url: '' }],
      profileType: 'member',
      userImage: factoryImage,
    })
    mockUser = completeUser

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
    mockUser = null as any

    render(<UserAction loggedIn={loggedIn} loggedOut={loggedOut} />)

    await screen.findByText('loggedOut')
  })
})
