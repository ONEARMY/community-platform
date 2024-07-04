import '@testing-library/jest-dom/vitest'

import { UserRole } from '@onearmy.apps/shared'
import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FactoryUser } from '../test/factories/User'
import { useCommonStores } from './hooks/useCommonStores'
import { DownloadWithDonationAsk } from './DownloadWithDonationAsk'

import type { Mock } from 'vitest'
import type { IUserPPDB } from '../models'
import type { IUploadedFileMeta } from '../stores/storage'

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}))

vi.mock('../common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: vi.fn(),
}))
const userToMock = (user?: IUserPPDB) => {
  return (useCommonStores as Mock).mockImplementation(() => ({
    stores: {
      userStore: { user: user ?? undefined },
      themeStore: {
        currentTheme: {
          donations: {
            body: '',
            iframeSrc: '',
            imageURL: '',
          },
        },
      },
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

  it('when logged in, opens via handleClick', () => {
    const user = FactoryUser()
    userToMock(user)

    const handleClick = vi.fn()
    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        handleClick={handleClick}
        isLoggedIn={true}
        fileDownloadCount={0}
        fileLink="http://youtube.com/"
        files={[]}
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(handleClick).toHaveBeenCalled()
  })

  it('when a beta-tester, opens the donation modal for fileLink', () => {
    const user = FactoryUser({ userRoles: [UserRole.BETA_TESTER] })
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

  it('when a beta-tester, opens the donation modal for files', () => {
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
