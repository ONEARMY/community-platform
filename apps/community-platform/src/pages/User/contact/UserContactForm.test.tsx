import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'mobx-react'
import { describe, expect, it, vi } from 'vitest'

import { useCommonStores } from '../../../common/hooks/useCommonStores'
import { FactoryUser } from '../../../test/factories/User'
import { contact } from '../labels'
import { UserContactForm } from './UserContactForm'

vi.mock('../../../common/hooks/useCommonStores', () => {
  return {
    useCommonStores: () => ({
      stores: {
        userStore: {
          getUserEmail: () => vi.fn().mockReturnValue('Bob@email.com'),
          activeUser: () => vi.fn().mockReturnValue(true),
        },
      },
    }),
  }
})

vi.mock('../../../services/message.service', () => {
  return {
    messageService: {
      sendMessage: () =>
        vi.fn().mockImplementation(() => {
          return Promise.resolve()
        }),
    },
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

    const submitButton = screen.getByTestId('contact-submit')
    await user.click(submitButton)
    await screen.findByText(contact.successMessage)
  })

  it('renders nothing if not profile is not contactable', () => {
    const uncontactable = FactoryUser({ isContactableByPublic: false })

    const { container } = render(
      <Provider {...useCommonStores().stores}>
        <UserContactForm user={uncontactable} />
      </Provider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
