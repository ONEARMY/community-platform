import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { act, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { IModerationStatus } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryMapPin } from 'src/test/factories/MapPin'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

import { MapPinServiceContext } from './map.service'
import Maps from './Maps'

import type { IMapPinService } from './map.service'

const Theme = testingThemeStyles

jest.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: jest.fn(),
        updateUserBadge: jest.fn(),
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
      tagsStore: {},
    },
  }),
}))

describe('Maps', () => {
  it('prompts on load for user current position', async () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: {
        getCurrentPosition: jest.fn(),
      },
    })

    await act(async () => {
      await Wrapper()
    })

    expect(global.navigator.geolocation.getCurrentPosition).toBeCalled()
  })

  it('loads individual map card', async () => {
    let wrapper: any

    await act(async () => {
      wrapper = await Wrapper('/map#abc')
    })

    await waitFor(async () => {
      expect(wrapper.mockMapPinService.getMapPinByUserId).toBeCalledWith('abc')
      expect(wrapper.renderResult.getByText('description')).toBeInTheDocument()
    })
  })
})

const Wrapper = async (path = '/map') => {
  const router = createMemoryRouter(
    createRoutesFromElements(<Route path="/map" element={<Maps />} />),
    {
      initialEntries: [path],
    },
  )

  const mockMapPinService: IMapPinService = {
    getMapPinByUserId: jest.fn().mockResolvedValue({
      ...FactoryUser({
        moderation: IModerationStatus.ACCEPTED,
      }),
      ...FactoryMapPin(),
      detail: {
        shortDescription: 'description',
      },
    }),
    getMapPinSelf: jest.fn().mockResolvedValue({}),
    getMapPins: jest.fn().mockImplementation(() => {
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
