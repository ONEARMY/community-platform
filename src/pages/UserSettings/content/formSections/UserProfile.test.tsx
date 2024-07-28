import '@testing-library/jest-dom/vitest'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { createRoutesFromElements, Route } from '@remix-run/react'
import { act, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserProfile } from './UserProfile.section'

import type { IUserPPDB } from 'src/models'

const Theme = testingThemeStyles

// eslint-disable-next-line prefer-const
let mockGetUserProfile = vi.fn().mockResolvedValue(FactoryUser)
const mockGetPin = vi.fn()
const mockUpdateUserBadge = vi.fn()
let mockUser = FactoryUser({})

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: mockGetUserProfile,
        updateUserBadge: mockUpdateUserBadge,
        getUserEmail: vi.fn(),
        user: mockUser,
        updateStatus: {
          Complete: false,
        },
      },
      aggregationsStore: {
        isVerified: vi.fn(),
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

describe('UserSettings', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('displays one photo for member', async () => {
    mockUser = FactoryUser({ profileType: 'member' })
    // Act
    let wrapper
    act(() => {
      wrapper = Wrapper(mockUser)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(1)
    })
  })

  it('displays four photos for collection point', async () => {
    mockUser = FactoryUser({ profileType: 'collection-point' })
    // Act
    let wrapper
    act(() => {
      wrapper = Wrapper(mockUser)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('displays four photos for community builder', async () => {
    mockUser = FactoryUser({ profileType: 'community-builder' })
    // Act
    let wrapper
    act(() => {
      wrapper = Wrapper(mockUser)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('displays four photos for machine builder', async () => {
    mockUser = FactoryUser({ profileType: 'machine-builder' })
    // Act
    let wrapper
    act(() => {
      wrapper = Wrapper(mockUser)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('displays four photos for space', async () => {
    mockUser = FactoryUser({ profileType: 'space' })
    // Act
    let wrapper
    act(() => {
      wrapper = Wrapper(mockUser)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('displays four photos for workspace', async () => {
    mockUser = FactoryUser({ profileType: 'workspace' })
    // Act
    let wrapper
    act(() => {
      wrapper = Wrapper(mockUser)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })
})

const Wrapper = (user: IUserPPDB, routerInitialEntry?: string) => {
  if (routerInitialEntry !== undefined) {
    // impact section is only displayed if isPreciousPlastic() is true
    window.localStorage.setItem('platformTheme', 'precious-plastic')
  }

  const router = createMemoryRouter(
    createRoutesFromElements(<Route index element={<UserProfile />} />),
    {
      initialEntries: [routerInitialEntry ? routerInitialEntry : ''],
    },
  )

  return render(
    <Provider
      {...useCommonStores().stores}
      userStore={{
        user,
        updateStatus: { Complete: true },
        getUserEmail: vi.fn(),
        getUserProfile: vi.fn().mockResolvedValue(user),
      }}
    >
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
