import { render } from '@testing-library/react'
import { ThemeProvider } from '@oa-components/core'
import { Provider } from 'mobx-react'
import { MemoryRouter } from 'react-router'
import { Route } from 'react-router-dom'
import { useResearchStore } from 'src/stores/Research/research.store'
import { FactoryResearchItem } from 'src/test/factories/ResearchItem'
import { preciousPlasticTheme } from 'oa-themes'
const Theme = preciousPlasticTheme.styles

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {},
      aggregationsStore: {
        aggregations: {
          users_votedUsefulResearch: {},
        },
      },
    },
  }),
}))

jest.mock('src/stores/Research/research.store')

import ResearchArticle from './ResearchArticle'

describe('Research Article', () => {
  const mockResearchStore = {
    activeResearchItem: FactoryResearchItem(),
    setActiveResearchItem: jest.fn().mockResolvedValue(true),
    needsModeration: jest.fn(),
    getActiveResearchUpdateComments: jest.fn(),
    incrementViewCount: jest.fn(),
  }

  it('does not display contributors when undefined', () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
      activeResearchItem: FactoryResearchItem({
        collaborators: undefined,
      }),
    })

    // Act
    const wrapper = render(
      <Provider userStore={{}}>
        <ThemeProvider theme={Theme}>
          <MemoryRouter initialEntries={['/research/article']}>
            <Route
              path="/research/:slug"
              exact
              key={1}
              component={ResearchArticle}
            />
          </MemoryRouter>
        </ThemeProvider>
        ,
      </Provider>,
    )

    // Assert
    expect(() => {
      wrapper.getAllByTestId('ArticleCallToAction: contributors')
    }).toThrow()
  })

  it('displays contributors', async () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
      activeResearchItem: FactoryResearchItem({
        collaborators: ['example-username', 'another-example-username'],
      }),
    })

    // Act
    const wrapper = render(
      <Provider userStore={{}}>
        <ThemeProvider theme={Theme}>
          <MemoryRouter initialEntries={['/research/article']}>
            <Route
              path="/research/:slug"
              exact
              key={1}
              component={ResearchArticle}
            />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>,
    )

    // Assert
    expect(wrapper.getAllByText('With contributions from:')).toHaveLength(1)
    expect(wrapper.getAllByText('example-username')).toHaveLength(1)
    expect(wrapper.getAllByText('another-example-username')).toHaveLength(1)
  })
})
