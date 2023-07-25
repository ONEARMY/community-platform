import { render, act } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { MemoryRouter } from 'react-router'
import { Route } from 'react-router-dom'
import { useCommonStores } from 'src'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { FactoryHowto, FactoryHowtoStep } from 'src/test/factories/Howto'
import { preciousPlasticTheme } from 'oa-themes'
const Theme = preciousPlasticTheme.styles

const mockHowtoStore = () => ({
  setActiveHowtoBySlug: jest.fn(),
  activeHowto: FactoryHowto(),
  getActiveHowToComments: jest.fn().mockReturnValue([]),
  needsModeration: jest.fn().mockReturnValue(false),
  incrementViewCount: jest.fn(),
  removeActiveHowto: jest.fn(),
})

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {},
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
      howtoStore: mockHowtoStore(),
      tagsStore: {},
    },
  }),
}))

import { Howto } from './Howto'

const factory = async (howtoStore?: Partial<HowtoStore>) =>
  render(
    <Provider
      {...useCommonStores().stores}
      howtoStore={howtoStore || useCommonStores().stores.howtoStore}
    >
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={['/howto/article']}>
          <Route path="/howto/:slug" exact key={1} component={Howto} />
        </MemoryRouter>
      </ThemeProvider>
      ,
    </Provider>,
  )

describe('Howto', () => {
  it('shows verified badge', async () => {
    let wrapper
    await act(async () => {
      wrapper = await factory({
        ...mockHowtoStore(),
        activeHowto: FactoryHowto({
          _createdBy: 'HowtoAuthor',
        }),
      })
    })

    expect(() => {
      wrapper.getAllByTestId('Username: verified badge')
    }).not.toThrow()
  })

  it('does not show verified badge', async () => {
    let wrapper
    await act(async () => {
      wrapper = await factory()
    })

    expect(() => {
      wrapper.getAllByTestId('Username: verified badge')
    }).toThrow()
  })

  describe('steps', () => {
    it('shows 1 step', async () => {
      let wrapper
      await act(async () => {
        wrapper = await factory({
          ...mockHowtoStore(),
          activeHowto: FactoryHowto({
            _createdBy: 'HowtoAuthor',
            steps: [FactoryHowtoStep()],
          }),
        })
      })

      expect(() => {
        wrapper.getAllByText('1 step')
      }).not.toThrow()
    })

    it('shows 2 steps', async () => {
      let wrapper
      await act(async () => {
        wrapper = await factory({
          ...mockHowtoStore(),
          activeHowto: FactoryHowto({
            _createdBy: 'HowtoAuthor',
            steps: [FactoryHowtoStep(), FactoryHowtoStep()],
          }),
        })
      })

      expect(() => {
        wrapper.getAllByText('2 steps')
      }).not.toThrow()
    })
  })
})
