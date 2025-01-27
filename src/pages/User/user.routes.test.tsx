import '@testing-library/jest-dom/vitest'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { createRoutesFromElements } from '@remix-run/react'
import { act, render, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserRoutes } from './user.routes'

import type { IUserDB } from 'oa-shared'

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
        updateUserBadge: mockUpdateUserBadge,
      },
      aggregationsStore: {
        updateVerifiedUsers: vi.fn(),
        users_verified: {
          LibraryAuthor: true,
        },
      },
      mapsStore: {
        getPin: mockGetPin,
      },
      tagsStore: {},
    },
  }),
}))

vi.mock('src/services/messageService', () => {
  return {
    messageService: {
      sendMessage: () =>
        vi.fn().mockImplementation(() => {
          return Promise.resolve()
        }),
    },
  }
})

describe('User', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('displays user page', async () => {
    const user = FactoryUser()

    // Act
    let wrapper
    act(() => {
      wrapper = getWrapper(user)
    })

    // Assert
    await waitFor(() => {
      expect(wrapper.getByText(user.displayName)).toBeInTheDocument()
    })
  })

  describe('workspace', () => {
    it('handles workspace with no images', async () => {
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
      await waitFor(() => {
        expect(wrapper.getByText('No images available.')).toBeInTheDocument()
      })
    })
  })
})

const getWrapper = (user: IUserDB, url?: string) => {
  mockGetUserProfile.mockResolvedValue(user)

  const router = createMemoryRouter(
    createRoutesFromElements(UserRoutes(user)),
    {
      initialEntries: [url || `/u/${user?.userName}`],
      basename: '/u',
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
        getUserCreatedDocs: vi.fn(),
      }}
    >
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
