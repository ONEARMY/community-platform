import { act, render } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { MemoryRouter } from 'react-router'
import { Route } from 'react-router-dom'
import { useResearchStore } from 'src/stores/Research/research.store'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'
import ResearchArticle from './ResearchArticle'
import { getTestingThemeStyles } from 'src/test/utils/themeUtils'
const Theme = getTestingThemeStyles()

const activeUser = FactoryUser({
  userRoles: ['beta-tester'],
})

const mockUser = FactoryUser({ country: 'AF' })

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserByUsername: jest.fn().mockResolvedValue(mockUser),
      },
      aggregationsStore: {
        aggregations: {
          users_votedUsefulResearch: {},
        },
      },
    },
  }),
}))

jest.mock('src/stores/Research/research.store')

describe('Research Article', () => {
  const mockResearchStore = {
    activeResearchItem: FactoryResearchItem(),
    setActiveResearchItemBySlug: jest.fn().mockResolvedValue(true),
    needsModeration: jest.fn(),
    getActiveResearchUpdateComments: jest.fn(),
    incrementViewCount: jest.fn(),
  }

  it('does not display contributors when undefined', async () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
      activeResearchItem: FactoryResearchItem({
        collaborators: undefined,
      }),
    })

    // Act
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
    })

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
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
    })

    // Assert
    expect(wrapper.getAllByText('With contributions from:')).toHaveLength(1)
    expect(wrapper.getAllByText('example-username')).toHaveLength(1)
    expect(wrapper.getAllByText('another-example-username')).toHaveLength(1)
    expect(wrapper.getAllByTestId('Username: known flag')).toHaveLength(2)
  })

  it('displays "Follow" button text and color if not subscribed', async () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
      activeUser,
    })

    // Act
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
    })
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
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
    })
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
              collaborators: ['third-example-username'],
              status: 'published',
              _deleted: false,
            }),
          ],
        }),
      })

      // wait for Promise to resolve and state to update
      let wrapper
      await act(async () => {
        wrapper = getWrapper()
      })

      // Assert
      expect(wrapper.getByText('With contributions from:')).toBeInTheDocument()
      expect(wrapper.getByText('example-username')).toBeInTheDocument()
      expect(wrapper.getByText('another-example-username')).toBeInTheDocument()
      expect(wrapper.getByText('third-example-username')).toBeInTheDocument()
      expect(wrapper.getAllByTestId('Username: known flag')).toHaveLength(3)
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
            status: 'published',
            _deleted: false,
          }),
          FactoryResearchItemUpdate({
            title: 'Research Update #2',
            status: 'draft',
            _deleted: false,
          }),
        ],
      }),
    })

    // Act
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
    })

    // Assert
    expect(wrapper.getByText('Research Update #1')).toBeInTheDocument()
    expect(wrapper.queryByText('Research Update #2')).not.toBeInTheDocument()
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
