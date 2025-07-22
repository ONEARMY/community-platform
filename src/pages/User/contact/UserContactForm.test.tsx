import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { contact } from '../labels'
import { UserContactForm } from './UserContactForm'

import type { Profile } from 'oa-shared'

vi.mock('src/services/messageService', () => {
  return {
    messageService: {
      sendMessage: () =>
        new Response(null, { status: 200, statusText: 'ALLL good!' }),
    },
  }
})

describe('UserContactForm', () => {
  const profileUser = FactoryUser({ isContactable: true })

  it('sends an message to the store', async () => {
    const user = userEvent.setup()

    render(
      <ProfileStoreProvider>
        <UserContactForm user={profileUser as Profile} />
      </ProfileStoreProvider>,
    )

    await screen.findByText(`Send a message to ${profileUser.displayName}`)

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
    const uncontactable = FactoryUser({ isContactable: false })

    const { container } = render(
      <ProfileStoreProvider>
        <UserContactForm user={uncontactable as Profile} />
      </ProfileStoreProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
