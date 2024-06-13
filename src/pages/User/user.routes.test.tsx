import '@testing-library/jest-dom/vitest'

import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { act, render } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import UserProfileRoutes from './user.routes'

const Theme = testingThemeStyles

// eslint-disable-next-line prefer-const
let mockGetUserProfile = vi.fn().mockResolvedValue(FactoryUser)
const mockGetPin = vi.fn()
const mockUpdateUserBadge = vi.fn()

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: mockGetUserProfile,
        updateUserBadge: mockUpdateUserBadge,
        getUserCreatedDocs: vi.fn(),
      },
      aggregationsStore: {
        updateVerifiedUsers: vi.fn(),
        users_verified: {
          HowtoAuthor: true,
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

describe('User', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('displays user page', async () => {
    const user = FactoryUser()

    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(user)
    })

    // Assert
    expect(wrapper.getByText(user.displayName)).toBeInTheDocument()
  })

  it('displays user not found page', async () => {
    // Act
    let wrapper
    await act(async () => {
      wrapper = await getWrapper(null, '/u/does-not-exist')
    })

    // Assert
    expect(wrapper.getByText('User not found')).toBeInTheDocument()
  })

  describe('workspace', () => {
    it('handles workspace with no images', async () => {
      const user = FactoryUser({
        profileType: 'workspace',
        coverImages: [],
      })

      // Act
      let wrapper
      await act(async () => {
        wrapper = await getWrapper(user)
      })

      // Assert
      expect(wrapper.getByText('No images available.')).toBeInTheDocument()
    })
  })
})

const getWrapper = async (user, url?) => {
  mockGetUserProfile.mockResolvedValue(user)

  return render(
    <Provider
      {...useCommonStores().stores}
      userStore={{
        user,
        updateStatus: { Complete: true },
        getUserEmail: vi.fn(),
        getUserProfile: vi.fn().mockResolvedValue(user),
        getUserCreatedDocs: vi.fn(),
      }}
    >
      <ThemeProvider theme={Theme}>
        <MemoryRouter
          initialEntries={[url || `/u/${user.userName}`]}
          basename="/u"
        >
          <UserProfileRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}
