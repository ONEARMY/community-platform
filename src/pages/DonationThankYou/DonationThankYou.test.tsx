import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import DonationThankYou from './DonationThankYou'

describe('DonationThankYou', () => {
  it('sends the expected message', () => {
    const spy = vi.spyOn(window.top, 'postMessage' as never)
    render(<DonationThankYou />)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('CAN_START_FILE_DOWNLOAD', '*')
  })
})
