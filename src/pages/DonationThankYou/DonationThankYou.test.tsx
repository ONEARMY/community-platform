import { render } from '@testing-library/react'

import DonationThankYou from './DonationThankYou'

describe('DonationThankYou', () => {
  it('sends the expected message', () => {
    window.top.postMessage = jest.fn()

    render(<DonationThankYou />)

    expect(window?.top?.postMessage).toBeCalledTimes(1)
    expect(window?.top?.postMessage).toBeCalledWith(
      'CAN_START_FILE_DOWNLOAD',
      '*',
    )
  })
})
