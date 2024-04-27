import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { act, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

import Maps from './Maps'

const Theme = testingThemeStyles

const mockMapStore = {
  activePin: null,
  getPin: jest.fn(),
  retrieveMapPins: jest.fn(),
  retrievePinFilters: jest.fn(),
  removeSubscriptions: jest.fn(),
  setActivePin: jest.fn(),
  getPinsNumberByFilterType: jest.fn(),
  canSeePin: jest.fn(),
  needsModeration: jest.fn(),
  setMapBoundingBox: jest.fn(),
  filteredPins: [],
}

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
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('prompts on load for user current position', async () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: {
        getCurrentPosition: jest.fn(),
      },
    })

    await Wrapper()

    expect(global.navigator.geolocation.getCurrentPosition).toBeCalled()
  })

  it('loads individual map card', async () => {
    mockMapStore.getPin.mockResolvedValue({
      _id: 'abc',
      title: 'title',
      description: 'description',
      detail: {
        shortDescription: 'description',
      },
      location: {
        lat: 1,
        lng: 2,
      },
      tags: [],
    })
    mockMapStore.setActivePin.mockImplementation((v) => {
      mockMapStore.activePin = v
    })
    mockMapStore.canSeePin.mockReturnValue(true)
    mockMapStore.needsModeration.mockReturnValue(true)

    let wrapper

    await act(async () => {
      wrapper = await Wrapper('/map#abc')
    })

    await waitFor(async () => {
      expect(mockMapStore.setActivePin).toBeCalled()
      expect(wrapper.getByText('description')).toBeInTheDocument()
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

  return render(
    <Provider {...useCommonStores().stores}>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
