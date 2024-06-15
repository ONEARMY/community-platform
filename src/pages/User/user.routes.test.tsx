import '@testing-library/jest-dom/vitest'

import {
  createMemoryRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { act, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserRoutes } from './user.routes'

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

  it('displays user page', () => {
    const user = FactoryUser()

    // Act
    let wrapper
    act(() => {
      wrapper = getWrapper(user)
    })

    // Assert
    waitFor(() => {
      expect(wrapper.getByText(user.displayName)).toBeInTheDocument()
    })
  })

  it('displays user not found page', () => {
    // Act
    let wrapper
    act(() => {
      wrapper = getWrapper(null, '/u/does-not-exist')
    })

    // Assert
    waitFor(() => {
      expect(wrapper.getByText('User not found')).toBeInTheDocument()
    })
  })

  describe('workspace', () => {
    it('handles workspace with no images', () => {
      const user = FactoryUser({
        profileType: 'workspace',
        coverImages: [],
      })

      // Act
      let wrapper
      act(() => {
        wrapper = getWrapper(user)
      })

      // Assert
      waitFor(() => {
        expect(wrapper.getByText('No images available.')).toBeInTheDocument()
      })
    })
  })
})

const getWrapper = (user, url?) => {
  mockGetUserProfile.mockResolvedValue(user)

  const router = createMemoryRouter(createRoutesFromElements(UserRoutes), {
    initialEntries: [url || `/u/${user.userName}`],
    basename: '/u',
  })

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
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
