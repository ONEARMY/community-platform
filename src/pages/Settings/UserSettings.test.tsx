import { render, waitFor, screen } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { UserSettings } from './UserSettings'
import { useCommonStores } from 'src'
import { FactoryUser } from '../../test/factories/User'
import { MemoryRouter } from 'react-router'
import { ThemeProvider } from 'theme-ui'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'

// eslint-disable-next-line prefer-const
let mockGetUserProfile = jest.fn().mockResolvedValue(FactoryUser)
const mockUpdateUserBadge = jest.fn()

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: mockGetUserProfile,
        updateUserBadge: mockUpdateUserBadge,
      },
      aggregationsStore: {
        aggregations: {
          users_votedUsefulHowtos: {
            HowtoAuthor: 0,
          },
          users_verified: {
            HowtoAuthor: true,
          },
        },
      },
      themeStore: {
        currentTheme: {
          styles: {
            communityProgramURL: '',
          },
        },
      },
      mapsStore: {},
      tagsStore: {},
    },
  }),
}))

describe('UserSettings', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('displays user settings', () => {
    const wrapper = render(
      <Provider
        {...useCommonStores().stores}
        userStore={{
          user: FactoryUser(),
          updateStatus: { Complete: true },
          getUserEmail: jest.fn(),
        }}
      >
        <ThemeProvider theme={preciousPlasticTheme.styles}>
          <MemoryRouter>
            <UserSettings />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>,
    )

    expect(wrapper.getByText('Edit profile'))
    expect(() => wrapper.getByText('Admin settings')).toThrow()
  })

  it('displays admin only settings', async () => {
    const user = FactoryUser({
      userRoles: ['admin'],
    })

    const wrapper = render(
      <Provider
        {...useCommonStores().stores}
        userStore={{
          user,
          updateStatus: { Complete: true },
          getUserEmail: jest.fn(),
          getUserProfile: jest.fn().mockResolvedValue(user),
        }}
      >
        <ThemeProvider theme={preciousPlasticTheme.styles}>
          <MemoryRouter>
            <UserSettings adminEditableUserId={user._id} />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>,
    )

    // Assert
    await waitFor(() => wrapper.getByText('Admin settings'))
  })

  it('presents the state', async () => {
    const user = FactoryUser({
      userRoles: ['admin'],
      badges: {
        verified: true,
        supporter: true,
      },
    })

    mockGetUserProfile.mockResolvedValue(user)

    // Act
    const wrapper = render(
      <Provider
        {...useCommonStores().stores}
        userStore={{
          user,
          updateStatus: { Complete: true },
          getUserEmail: jest.fn(),
          getUserProfile: jest.fn().mockResolvedValue(user),
        }}
      >
        <ThemeProvider theme={preciousPlasticTheme.styles}>
          <MemoryRouter>
            <UserSettings adminEditableUserId={user._id} />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>,
    )

    // Assert
    await waitFor(() => {
      screen.getByText('Update badges')
    })

    expect(wrapper.getByLabelText('Verified')).toBeChecked()
    expect(wrapper.getByLabelText('Supporter')).toBeChecked()
  })

  it('saves state', async () => {
    const user = FactoryUser({
      userRoles: ['admin'],
    })

    mockGetUserProfile.mockResolvedValue(user)

    // Act
    const wrapper = render(
      <Provider
        {...useCommonStores().stores}
        userStore={{
          user,
          updateStatus: { Complete: true },
          getUserEmail: jest.fn(),
          getUserProfile: jest.fn().mockResolvedValue(user),
        }}
      >
        <ThemeProvider theme={preciousPlasticTheme.styles}>
          <MemoryRouter>
            <UserSettings adminEditableUserId={user._id} />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>,
    )

    // Assert
    await waitFor(() => screen.getByText('Update badges').click())

    wrapper.getByLabelText('Verified').click()

    expect(mockUpdateUserBadge).toBeCalledTimes(1)
    expect(mockUpdateUserBadge).toBeCalledWith(user._id, {
      supporter: false,
      verified: true,
    })
  })
})
