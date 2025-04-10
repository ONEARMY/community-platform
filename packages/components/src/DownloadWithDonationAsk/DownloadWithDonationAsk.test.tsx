import '@testing-library/jest-dom/vitest'

import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DownloadWithDonationAsk } from './DownloadWithDonationAsk'

import type { MediaFile } from 'oa-shared'

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}))

vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: vi.fn(),
}))

const downloadProps = {
  body: 'Body Text for the donation request',
  iframeSrc: 'https://donorbox.org/embed/ppcpdonor?language=en',
  imageURL:
    'https://images.unsplash.com/photo-1520222984843-df35ebc0f24d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9',
}

describe('DownloadWithDonationAsk', () => {
  it('opens the donation modal for fileLink', () => {
    const handleClick = vi.fn()
    const fileLink = 'http://youtube.com/'

    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        {...downloadProps}
        handleClick={handleClick}
        fileDownloadCount={0}
        fileLink={fileLink}
        files={[]}
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(getAllByTestId('DonationRequestSkip')[0]).toHaveAttribute(
      'href',
      fileLink,
    )
    expect(getAllByTestId('DonationRequest')[0]).toBeInTheDocument()
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('opens the donation modal for files', () => {
    const publicUrl = 'http://great-url.com/'
    const handleClick = vi.fn()

    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        {...downloadProps}
        handleClick={handleClick}
        fileDownloadCount={0}
        fileLink={undefined}
        files={[
          {
            publicUrl,
            name: 'first-file',
            size: 435435,
          } as MediaFile,
        ]}
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(getAllByTestId('DonationRequestSkip')[0]).toHaveAttribute(
      'href',
      publicUrl,
    )
    expect(getAllByTestId('DonationRequest')[0]).toBeInTheDocument()
    expect(handleClick).not.toHaveBeenCalled()
  })
})
