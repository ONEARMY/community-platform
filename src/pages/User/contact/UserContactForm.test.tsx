import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { UserContactForm } from './UserContactForm'

vi.mock('src/common/hooks/useCommonStores', () => {
  return {
    useCommonStores: () => ({
      stores: {
        messageStore: {
          upload: () => vi.fn(),
        },
        userStore: {
          getUserEmail: () => vi.fn().mockReturnValue('Bob@email.com'),
          activeUser: () => vi.fn().mockReturnValue(true),
        },
      },
    }),
  }
})

describe('UserContactForm', () => {
  const profileUser = FactoryUser({ isContactableByPublic: true })

  it('sends an message to the store', async () => {
    const user = userEvent.setup()

    render(
      <Provider {...useCommonStores().stores}>
        <UserContactForm user={profileUser} />
      </Provider>,
    )

    await screen.findByText(`Send a message to ${profileUser.userName}`)

    await user.type(screen.getByTestId('name'), 'Bob')
    await user.type(
      screen.getByTestId('message'),
      'I need to learn about plastics',
    )

    await user.click(screen.getByTestId('contact-submit'))
    await screen.findByText('All sent')
  })

  it('renders nothing if not profile is not contactable', async () => {
    const uncontactable = FactoryUser({ isContactableByPublic: false })

    const { container } = render(
      <Provider {...useCommonStores().stores}>
        <UserContactForm user={uncontactable} />
      </Provider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
