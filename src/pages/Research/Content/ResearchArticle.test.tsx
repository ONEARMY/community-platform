import { render } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { MemoryRouter } from 'react-router'
import { Route } from 'react-router-dom'
import { useResearchStore } from 'src/stores/Research/research.store'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { preciousPlasticTheme } from 'oa-themes'
import ResearchArticle from './ResearchArticle'
import { FactoryUser } from 'src/test/factories/User'

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

const activeUser = FactoryUser({
  userRoles: ['beta-tester'],
})

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
    const wrapper = getWrapper()

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
    const wrapper = getWrapper()

    // Assert
    expect(wrapper.getAllByText('With contributions from:')).toHaveLength(1)
    expect(wrapper.getAllByText('example-username')).toHaveLength(1)
    expect(wrapper.getAllByText('another-example-username')).toHaveLength(1)
  })

  it('displays "Follow" button text and color if not subscribed', async () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
    })

    // Act
    const wrapper = getWrapper()
    const followButton = wrapper.getByTestId('follow-button')

    // Assert
    expect(wrapper.getAllByText('Follow').length).toBeGreaterThan(0)
    expect(followButton).toBeInTheDocument()
    expect(followButton).toHaveAttribute('iconcolor', 'notSubscribed')
  })

  it('displays "Following" button text and color if user is subscribed', async () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
      activeResearchItem: FactoryResearchItem({
        subscribers: [activeUser.userName],
      }),
      activeUser,
    })

    // Act
    const wrapper = getWrapper()
    const followButton = wrapper.getByTestId('follow-button')

    // Assert
    expect(wrapper.getAllByText('Following').length).toBeGreaterThan(0)

    expect(followButton).toBeInTheDocument()
    expect(followButton).toHaveAttribute('iconcolor', 'subscribed')
  })

  describe('Research Update', () => {
    it('displays contributors', async () => {
      // Arrange
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeResearchItem: FactoryResearchItem({
          collaborators: ['example-username', 'another-example-username'],
          updates: [
            FactoryResearchItemUpdate({
              title: 'Research Update #1',
              collaborators: ['example'],
            }),
          ],
        }),
      })

      // Act
      const wrapper = getWrapper()

      // Assert
      expect(
        wrapper.getAllByTestId('Username: unknown flag').length,
      ).toBeGreaterThanOrEqual(1)
      expect(wrapper.getAllByText('example-username')).toHaveLength(1)
      expect(wrapper.getAllByText('another-example-username')).toHaveLength(1)
    })
  })

  it('shows only published updates', async () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
      activeResearchItem: FactoryResearchItem({
        collaborators: ['example-username', 'another-example-username'],
        updates: [
          FactoryResearchItemUpdate({
            title: 'Research Update #1',
          }),
          FactoryResearchItemUpdate({
            title: 'Research Update #2',
            status: 'draft',
          }),
        ],
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
    expect(() => {
      wrapper.getByText('Research Update #1')
      wrapper.getByText('Research Update #2')
    }).toThrow()
  })
})

const getWrapper = () => {
  return render(
    <Provider
      userStore={{
        user: activeUser,
      }}
    >
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
}
