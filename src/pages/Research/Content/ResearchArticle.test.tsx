import { render } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { MemoryRouter } from 'react-router'
import { Route } from 'react-router-dom'
import { useResearchStore } from 'src/stores/Research/research.store'
import { FactoryResearchItem } from 'src/test/factories/ResearchItem'
import Theme from 'src/themes/styled.theme'

jest.mock('src/index', () => ({
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
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={['/research/article']}>
          <Route
            path="/research/:slug"
            exact
            key={1}
            component={ResearchArticle}
          />
        </MemoryRouter>
      </ThemeProvider>,
    )

    // Assert
    expect(() => {
      wrapper.getAllByText('With contributions from:')
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
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={['/research/article']}>
          <Route
            path="/research/:slug"
            exact
            key={1}
            component={ResearchArticle}
          />
        </MemoryRouter>
      </ThemeProvider>,
    )

    // Assert
    expect(wrapper.getAllByText('With contributions from:')).toHaveLength(1)
    expect(wrapper.getAllByText('example-username')).toHaveLength(1)
    expect(wrapper.getAllByText('another-example-username')).toHaveLength(1)
  })
})
