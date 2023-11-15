import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'mobx-react'

import { useCommonStores } from 'src/index'
import { FactoryUser } from 'src/test/factories/User'
import { UserContactForm } from '.'

jest.mock('src/index', () => {
  return {
    useCommonStores: () => ({
      stores: {
        messageStore: {
          upload: () => jest.fn(),
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
    await user.type(screen.getByTestId('email'), 'Bob@email.com')
    await user.type(
      screen.getByTestId('message'),
      'I need to learn about plastics',
    )

    await user.click(screen.getByTestId('contact-submit'))
    await screen.findByText('All sent')
  })

  it('renders nothing with user not contactable', async () => {
    const uncontactable = FactoryUser({ isContactableByPublic: false })

    const { container } = render(
      <Provider {...useCommonStores().stores}>
        <UserContactForm user={uncontactable} />
      </Provider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
