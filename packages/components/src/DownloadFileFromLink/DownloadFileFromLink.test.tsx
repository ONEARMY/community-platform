import '@testing-library/jest-dom/vitest'

import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DownloadFileFromLink } from './DownloadFileFromLink'

import type { IUploadedFileMeta } from './types'

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}))

vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: vi.fn(),
}))

describe('DownloadFileFromLink', () => {
  it('when logged out, requires users to login', () => {
    const { getAllByTestId } = render(
      <DownloadFileFromLink
        handleClick={vi.fn()}
        isLoggedIn={false}
        fileDownloadCount={0}
        fileLink="http://youtube.com/"
        files={[]}
        themeStoreDonationProps={{}}
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/sign-in')
  })

  it('when logged in, opens the donation modal for fileLink', () => {
    const handleClick = vi.fn()
    const fileLink = 'http://youtube.com/'

    const { getAllByTestId } = render(
      <DownloadFileFromLink
        handleClick={handleClick}
        isLoggedIn={true}
        fileDownloadCount={0}
        fileLink={fileLink}
        files={[]}
        themeStoreDonationProps={{}}
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

  it('when logged in, opens the donation modal for files', () => {
    const downloadUrl = 'http://great-url.com/'
    const handleClick = vi.fn()

    const { getAllByTestId } = render(
      <DownloadFileFromLink
        handleClick={handleClick}
        isLoggedIn={true}
        fileDownloadCount={0}
        fileLink={undefined}
        files={[
          {
            downloadUrl,
            name: 'first-file',
            size: 435435,
          } as IUploadedFileMeta,
        ]}
        themeStoreDonationProps={{}}
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(getAllByTestId('DonationRequestSkip')[0]).toHaveAttribute(
      'href',
      downloadUrl,
    )
    expect(getAllByTestId('DonationRequest')[0]).toBeInTheDocument()
    expect(handleClick).not.toHaveBeenCalled()
  })
})
