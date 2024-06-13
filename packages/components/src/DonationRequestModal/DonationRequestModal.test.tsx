import '@testing-library/jest-dom/vitest'

import { describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { DonationRequestModal } from './DonationRequestModal'

describe('DonationRequestModal', () => {
  const link = 'http://bbc.co.uk/'
  const body =
    'All of the content here is free. Your donation supports this library of Open Source recycling knowledge. Making it possible for everyone in the world to use it and start recycling.'
  const iframeSrc =
    'https://donorbox.org/embed/precious-plastic-2?default_interval=o&amp;a=b'
  const imageURL =
    'https://images.unsplash.com/photo-1520222984843-df35ebc0f24d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9'

  it('shows the modal when isOpen is true', () => {
    const mockCall = vi.fn()

    const { getByText } = render(
      <DonationRequestModal
        body={body}
        callback={vi.fn()}
        iframeSrc={iframeSrc}
        imageURL={imageURL}
        isOpen={true}
        link={link}
        onDidDismiss={mockCall}
      />,
    )

    expect(getByText(body)).toBeInTheDocument()
  })

  it("doesn't shows the modal when isOpen is false", () => {
    const { container } = render(
      <DonationRequestModal
        body={body}
        callback={vi.fn()}
        iframeSrc={iframeSrc}
        imageURL={imageURL}
        isOpen={false}
        link={link}
        onDidDismiss={() => vi.fn()}
      />,
    )

    expect(container.innerHTML).toBe('')
  })
})
