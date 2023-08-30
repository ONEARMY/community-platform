import { render, act, waitFor, screen } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { UserSettings } from './UserSettings'
import { useCommonStores } from 'src'
import { FactoryUser } from 'src/test/factories/User'
import { MemoryRouter } from 'react-router'
import { ThemeProvider } from 'theme-ui'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
const Theme = testingThemeStyles

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
          users_totalUseful: {
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

  it('displays user settings', async () => {
    const user = FactoryUser()

    // Act
    const wrapper = await getWrapper(user)

    // Assert
    expect(wrapper.getByText('Edit profile'))
    expect(() => wrapper.getByText('Admin settings')).toThrow()
  })

  it('displays admin only settings', async () => {
    const user = FactoryUser({
      userRoles: ['admin'],
    })

    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })

    // Assert
    await waitFor(() => wrapper.getByText('Admin settings'))
  })

  it('displays one photo for member', async () => {
    const user = FactoryUser({ profileType: 'member' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(1)
  })

  it('displays four photos for collection point', async () => {
    const user = FactoryUser({ profileType: 'collection-point' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  it('displays four photos for community builder', async () => {
    const user = FactoryUser({ profileType: 'community-builder' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  it('displays four photos for machine builder', async () => {
    const user = FactoryUser({ profileType: 'machine-builder' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  it('displays four photos for space', async () => {
    const user = FactoryUser({ profileType: 'space' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  it('displays four photos for workspace', async () => {
    const user = FactoryUser({ profileType: 'workspace' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
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
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })

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
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })

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

const getWrapper = async (user) => {
  const isAdmin = user.userRoles?.includes('admin')

  return render(
    <Provider
      {...useCommonStores().stores}
      userStore={{
        user,
        updateStatus: { Complete: true },
        getUserEmail: jest.fn(),
        getUserProfile: jest.fn().mockResolvedValue(user),
      }}
    >
      <ThemeProvider theme={Theme}>
        <MemoryRouter>
          <UserSettings adminEditableUserId={isAdmin ? user._id : null} />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}
