import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import DonationThankYou from './DonationThankYou'

describe('DonationThankYou', () => {
  it('sends the expected message', () => {
    window.top.postMessage = vi.fn()

    render(<DonationThankYou />)

    expect(window?.top?.postMessage).toBeCalledTimes(1)
    expect(window?.top?.postMessage).toBeCalledWith(
      'CAN_START_FILE_DOWNLOAD',
      '*',
    )
  })
})
