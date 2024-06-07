import '@testing-library/jest-dom/vitest'

import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { BUTTON_LABEL,DonationRequest } from './DonationRequest'

describe('DonationRequest', () => {
  it('shows the expected content', async () => {
    const body = 'All of the content here is free.'
    const iframeSrc = 'https://bbc.co.uk/'
    const imageURL = 'anyold.png'

    const screen = render(
      <DonationRequest
        body={body}
        callback={() => console.log('skipped')}
        iframeSrc={iframeSrc}
        imageURL={imageURL}
        link=""
      />,
    )
    const image = screen.getByTestId('donationRequestImage')
    const iframe = screen.getByTestId('donationRequestIframe')

    await screen.findAllByText(body)
    expect(image).toHaveAttribute('src', imageURL)
    expect(iframe).toHaveAttribute('src', iframeSrc)
  })

  it('calls the callback when user skips', () => {
    const body = 'All of the content here is free.'
    const mockCallback = vi.fn()

    const screen = render(
      <DonationRequest
        body={body}
        callback={mockCallback}
        iframeSrc=""
        imageURL=""
        link=""
      />,
    )

    const skipButton = screen.getByText(BUTTON_LABEL)
    fireEvent.click(skipButton)

    expect(mockCallback).toHaveBeenCalled()
  })
})
