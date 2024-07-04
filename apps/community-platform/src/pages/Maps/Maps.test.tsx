import '@testing-library/jest-dom/vitest'

import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { IModerationStatus } from '@onearmy.apps/shared'
import { act, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { describe, expect, it, vi } from 'vitest'

import { useCommonStores } from '../../common/hooks/useCommonStores'
import { FactoryMapPin } from '../../test/factories/MapPin'
import { FactoryUser } from '../../test/factories/User'
import { testingThemeStyles } from '../../test/utils/themeUtils'
import { MapPinServiceContext } from './map.service'
import Maps from './Maps'

import type { IMapPinService } from './map.service'

const Theme = testingThemeStyles

vi.mock('../../common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: vi.fn(),
        updateUserBadge: vi.fn(),
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
      tagsStore: {},
    },
  }),
}))

describe('Maps', () => {
  it('prompts on load for user current position', async () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: {
        getCurrentPosition: vi.fn(),
      },
    })

    act(() => {
      Wrapper()
    })

    await waitFor(() => {
      expect(global.navigator.geolocation.getCurrentPosition).toBeCalled()
    })
  })

  it('loads individual map card', async () => {
    let wrapper: any

    act(() => {
      wrapper = Wrapper('/map#abc')
    })

    await waitFor(() => {
      expect(wrapper.mockMapPinService.getMapPinByUserId).toBeCalledWith('abc')
      expect(wrapper.renderResult.getByText('description')).toBeInTheDocument()
    })
  })
})

const Wrapper = (path = '/map') => {
  const router = createMemoryRouter(
    createRoutesFromElements(<Route path="/map" element={<Maps />} />),
    {
      initialEntries: [path],
    },
  )

  const mockMapPinService: IMapPinService = {
    getMapPinByUserId: vi.fn().mockResolvedValue({
      ...FactoryUser({
        moderation: IModerationStatus.ACCEPTED,
      }),
      ...FactoryMapPin(),
      detail: {
        shortDescription: 'description',
      },
    }),
    getMapPinSelf: vi.fn().mockResolvedValue({}),
    getMapPins: vi.fn().mockImplementation(() => {
      return Promise.resolve([])
    }),
  }

  return {
    mockMapPinService,
    renderResult: render(
      <Provider {...useCommonStores().stores}>
        <ThemeProvider theme={Theme}>
          <MapPinServiceContext.Provider value={mockMapPinService}>
            <RouterProvider router={router} />
          </MapPinServiceContext.Provider>
        </ThemeProvider>
      </Provider>,
    ),
  }
}
