import { Provider } from 'mobx-react'
import { render, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { useCommonStores } from '../../index'
import { ThemeProvider } from 'theme-ui'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import Maps from './Maps'
const Theme = testingThemeStyles

const mockMapStore = {
  activePin: null,
  getPin: vi.fn(),
  retrieveMapPins: vi.fn(),
  retrievePinFilters: vi.fn(),
  removeSubscriptions: vi.fn(),
  setActivePin: vi.fn(),
  getPinsNumberByFilterType: vi.fn(),
  canSeePin: vi.fn(),
  needsModeration: vi.fn(),
}

vi.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: vi.fn(),
        updateUserBadge: vi.fn(),
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
      mapsStore: mockMapStore,
      tagsStore: {},
    },
  }),
}))

describe('Maps', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('prompts on load for user current position', async () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: {
        getCurrentPosition: vi.fn(),
      },
    })

    await getWrapper()

    expect(global.navigator.geolocation.getCurrentPosition).toBeCalled()
  })

  it('loads individual map card', async () => {
    mockMapStore.getPin.mockResolvedValueOnce({
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
      wrapper = await getWrapper('/map#abc')
    })

    expect(mockMapStore.setActivePin).toBeCalled()

    expect(wrapper.getByText('description')).toBeInTheDocument()
  })
})

const getWrapper = async (path = '/map') => {
  return render(
    <Provider {...useCommonStores().stores}>
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={[path]}>
          <Maps />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}
