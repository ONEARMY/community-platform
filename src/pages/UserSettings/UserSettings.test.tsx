import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { act, render } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { IModerationStatus, UserRole } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryMapPin } from 'src/test/factories/MapPin'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

import { SettingsPage } from './SettingsPage'

const Theme = testingThemeStyles

// eslint-disable-next-line prefer-const
let mockGetUserProfile = jest.fn().mockResolvedValue(FactoryUser)
const mockGetPin = jest.fn()
const mockUpdateUserBadge = jest.fn()
let mockUser = FactoryUser({})

jest.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: mockGetUserProfile,
        updateUserBadge: mockUpdateUserBadge,
        getUserEmail: jest.fn(),
        user: mockUser,
        updateStatus: {
          Complete: false,
        },
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
    mockUser = FactoryUser()

    // Act
    let wrapper
    await act(async () => {
      wrapper = await Wrapper(mockUser)
    })

    // Assert
    expect(wrapper.getByText('Edit profile'))
  })

  it('displays one photo for member', async () => {
    mockUser = FactoryUser({ profileType: 'member' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await Wrapper(mockUser)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(1)
  })

  it('displays four photos for collection point', async () => {
    mockUser = FactoryUser({ profileType: 'collection-point' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await Wrapper(mockUser)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  it('displays four photos for community builder', async () => {
    mockUser = FactoryUser({ profileType: 'community-builder' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await Wrapper(mockUser)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  it('displays four photos for machine builder', async () => {
    mockUser = FactoryUser({ profileType: 'machine-builder' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await Wrapper(mockUser)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  it('displays four photos for space', async () => {
    mockUser = FactoryUser({ profileType: 'space' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await Wrapper(mockUser)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  it('displays four photos for workspace', async () => {
    mockUser = FactoryUser({ profileType: 'workspace' })
    // Act
    let wrapper
    await act(async () => {
      wrapper = await Wrapper(mockUser)
    })
    expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
  })

  describe('map pin', () => {
    it('displays moderation comments to user', async () => {
      mockUser = FactoryUser({ profileType: 'workspace' })
      mockGetPin.mockResolvedValue(
        FactoryMapPin({
          moderation: IModerationStatus.IMPROVEMENTS_NEEDED,
          comments: 'Moderator comment',
        }),
      )
      // Act
      let wrapper
      await act(async () => {
        wrapper = await Wrapper(mockUser)
      })
      expect(wrapper.getByText('Moderator comment')).toBeInTheDocument()
    })

    it('does not show moderation comments for approved pin', async () => {
      mockUser = FactoryUser({ profileType: 'workspace' })
      mockGetPin.mockResolvedValue(
        FactoryMapPin({
          moderation: IModerationStatus.ACCEPTED,
          comments: 'Moderator comment',
        }),
      )
      // Act
      let wrapper
      await act(async () => {
        wrapper = await Wrapper(mockUser)
      })

      expect(() => wrapper.getByText('Moderator comment')).toThrow()
    })
  })
})

const Wrapper = async (user) => {
  const isAdmin = user.userRoles?.includes(UserRole.ADMIN)

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
          <SettingsPage adminEditableUserId={isAdmin ? user._id : null} />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}
