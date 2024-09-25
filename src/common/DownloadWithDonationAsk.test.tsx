import '@testing-library/jest-dom/vitest'

import { fireEvent, render } from '@testing-library/react'
import { UserRole } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { useCommonStores } from './hooks/useCommonStores'
import { DownloadWithDonationAsk } from './DownloadWithDonationAsk'

import type { IUploadedFileMeta, IUserDB } from 'oa-shared'
import type { Mock } from 'vitest'

const mockedUsedNavigate = vi.fn()
vi.mock('@remix-run/react', () => ({
  useNavigate: () => mockedUsedNavigate,
}))

vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: vi.fn(),
}))
const userToMock = (user?: IUserDB) => {
  return (useCommonStores as Mock).mockImplementation(() => ({
    stores: {
      userStore: { user: user ?? undefined },
    },
  }))
}

describe('DownloadFileFromLink', () => {
  it('when logged out, requires users to login', () => {
    userToMock()
    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        handleClick={vi.fn()}
        isLoggedIn={false}
        fileDownloadCount={0}
        fileLink="http://youtube.com/"
        files={[]}
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/sign-in')
  })

  it('when logged in, opens the donation modal for fileLink', () => {
    const user = FactoryUser()
    userToMock(user)

    const handleClick = vi.fn()
    const fileLink = 'http://youtube.com/'

    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        handleClick={handleClick}
        isLoggedIn={true}
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

  it('when logged in, opens the donation modal for files', () => {
    const user = FactoryUser({ userRoles: [UserRole.BETA_TESTER] })
    userToMock(user)

    const downloadUrl = 'http://great-url.com/'
    const handleClick = vi.fn()

    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
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
