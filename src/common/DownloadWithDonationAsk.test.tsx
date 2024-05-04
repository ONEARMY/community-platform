import { fireEvent, render } from '@testing-library/react'
import { UserRole } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'

import { DownloadWithDonationAsk } from './DownloadWithDonationAsk'

import type { UserStore } from 'src/stores/User/user.store'

const mockUser = FactoryUser({
  userRoles: [UserRole.BETA_TESTER],
})
jest.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        user: mockUser,
      } as UserStore,
    },
  }),
}))

const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}))

describe('DownloadFileFromLink', () => {
  it('when logged out, requires users to login', () => {
    const { getAllByTestId } = render(
      <DownloadWithDonationAsk
        handleClick={jest.fn()}
        isLoggedIn={false}
        link="http://youtube.com/"
      />,
    )

    const downloadButton = getAllByTestId('downloadButton')[0]
    fireEvent.click(downloadButton)

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/sign-in')
  })

  it('when logged in, opens the link via handleClick', () => {
    const handleClick = jest.fn()

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

  it('when a PP beta-tester, opens the donation modal', () => {
    localStorage.setItem('platformTheme', 'precious-plastic')
    const handleClick = jest.fn()

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
