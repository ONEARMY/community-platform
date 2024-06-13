import '@testing-library/jest-dom/vitest'

import { fireEvent, render } from '@testing-library/react'
import { UserRole } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { useCommonStores } from './hooks/useCommonStores'
import { DownloadWithDonationAsk } from './DownloadWithDonationAsk'

import type { Mock } from 'vitest'

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}))

vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: vi.fn(),
}))
const userToMock = (user) => {
  return (useCommonStores as Mock).mockImplementation(() => ({
    stores: { userStore: { user } },
  }))
}

describe('DownloadFileFromLink', () => {
  it('when logged out, requires users to login', () => {
    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        handleClick={vi.fn()}
        isLoggedIn={false}
        link="http://youtube.com/"
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/sign-in')
  })

  it('when logged in, opens the link via handleClick', () => {
    const user = FactoryUser()
    userToMock(user)

    const handleClick = vi.fn()
    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        handleClick={handleClick}
        isLoggedIn={true}
        link="http://youtube.com/"
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(handleClick).toHaveBeenCalled()
  })

  it('when a beta-tester, opens the donation modal', () => {
    const user = FactoryUser({ userRoles: [UserRole.BETA_TESTER] })
    userToMock(user)

    const handleClick = vi.fn()

    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        handleClick={handleClick}
        isLoggedIn={true}
        link="http://youtube.com/"
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(getAllByTestId('DonationRequest')[0]).toBeInTheDocument()
    expect(handleClick).not.toHaveBeenCalled()
  })
})
