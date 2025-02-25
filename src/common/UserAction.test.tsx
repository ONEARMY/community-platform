import { render, screen } from '@testing-library/react'
import { SessionContext } from 'src/pages/common/SessionContext'
import { describe, it } from 'vitest'

import { UserAction } from './UserAction'

import type { User } from '@supabase/supabase-js'

const loggedIn = <>LoggedIn</>
const loggedOut = <>loggedOut</>

describe('UserAction', () => {
  it('should render the loggedIn component when a user is logged in', async () => {
    render(
      <SessionContext.Provider value={{ id: 'mock user' } as User}>
        <UserAction loggedIn={loggedIn} loggedOut={loggedOut} />
      </SessionContext.Provider>,
    )
    await screen.findByText('loggedIn', { exact: false })
  })

  it('should render the loggedOut component when a user is not logged in', async () => {
    render(
      <SessionContext.Provider value={null}>
        <UserAction loggedIn={loggedIn} loggedOut={loggedOut} />
      </SessionContext.Provider>,
    )

    await screen.findByText('loggedOut')
  })
})
