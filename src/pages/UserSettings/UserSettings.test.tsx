import { render, act } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { UserSettings } from './UserSettings'
import { useCommonStores } from 'src'
import { FactoryUser } from 'src/test/factories/User'
import { MemoryRouter } from 'react-router'
import { ThemeProvider } from 'theme-ui'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { FactoryMapPin } from 'src/test/factories/MapPin'
const Theme = testingThemeStyles

// eslint-disable-next-line prefer-const
let mockGetUserProfile = jest.fn().mockResolvedValue(FactoryUser)
const mockGetPin = jest.fn()
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
      mapsStore: {
        getPin: mockGetPin,
      },
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

  describe('map pin', () => {
    it('displays moderation comments to user', async () => {
      const user = FactoryUser({ profileType: 'workspace' })
      mockGetPin.mockResolvedValue(
        FactoryMapPin({
          moderation: 'improvements-needed',
          comments: 'Moderator comment',
        }),
      )
      // Act
      let wrapper
      await act(async () => {
        wrapper = await getWrapper(user)
      })
      expect(wrapper.getByText('Moderator comment')).toBeInTheDocument()
    })

    it('does not show moderation comments for approved pin', async () => {
      const user = FactoryUser({ profileType: 'workspace' })
      mockGetPin.mockResolvedValue(
        FactoryMapPin({
          moderation: 'accepted',
          comments: 'Moderator comment',
        }),
      )
      // Act
      let wrapper
      await act(async () => {
        wrapper = await getWrapper(user)
      })

      expect(() => wrapper.getByText('Moderator comment')).toThrow()
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
