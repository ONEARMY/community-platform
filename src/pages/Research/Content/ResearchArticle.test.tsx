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
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { useResearchItem } from 'src/pages/Research/Content/ResearchArticle.hooks'
jest.mock('src/pages/Research/Content/ResearchArticle.hooks')

const Theme = testingThemeStyles

const activeUser = FactoryUser({
  userRoles: ['beta-tester'],
})

const mockUser = FactoryUser({ country: 'nl' })

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserByUsername: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockUser)
        }),
      },
      aggregationsStore: {
        aggregations: {},
      },
    },
  }),
}))

jest.mock('src/stores/Research/research.store')

const mockResearchStore = {
  setActiveResearchItemBySlug: jest.fn().mockResolvedValue(true),
  needsModeration: jest.fn(),
  getActiveResearchUpdateComments: jest.fn(),
  incrementViewCount: jest.fn(),
}
describe('Research Article', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('displays author country flag', async () => {
    // Arrange
    ;(useResearchItem as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      researchItem: {
        ...FactoryResearchItem({
          _createdBy: mockUser.userName,
        }),
        author: {
          userName: mockUser.userName,
          countryCode: mockUser.country,
        },
      },
    }))

    // Act
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
    })

    // Assert
    expect(wrapper.container.querySelector('.flag-icon-nl')).toBeInTheDocument()
  })

  it('does not display contributors when undefined', async () => {
    // Arrange
    const researchItem = FactoryResearchItem({
      _createdBy: mockUser.userName,
    })

    ;(useResearchItem as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      researchAuthor: {
        userName: 'testUser',
        countryCode: 'nl',
        isVerified: true,
      },
      researchItem,
    }))

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
    const researchItem = FactoryResearchItem({
      collaborators: ['example-username', 'another-example-username'],
    })

    ;(useResearchItem as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      researchItem: {
        ...researchItem,
        author: {
          userName: 'testUser',
          countryCode: 'nl',
          isVerified: true,
        },
      },
    }))

    // Act
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
    })

    // Assert
    expect(wrapper.getAllByText('With contributions from:')).toHaveLength(1)
    expect(wrapper.getAllByText('example-username')).toHaveLength(2)
    expect(wrapper.getAllByText('another-example-username')).toHaveLength(2)
    expect(wrapper.getAllByTestId('Username: known flag')).toHaveLength(6)
  })

  it('displays "Follow" button for non-subscriber', async () => {
    // Arrange
    const researchItem = FactoryResearchItem({
      userHasSubscribed: false,
    })

    ;(useResearchItem as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      researchAuthor: {
        userName: 'testUser',
        countryCode: 'nl',
        isVerified: true,
      },
      researchItem,
      activeUser,
    }))

    // Act
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
    })
    const followButton = wrapper.getAllByTestId('follow-button')[0]

    // Assert
    expect(followButton).toBeInTheDocument()
    expect(followButton).toHaveTextContent('Follow')
    expect(followButton).not.toHaveTextContent('Following')
  })

  it.todo('displays "Following" button for subscriber')

  // TODO: Work out how to simulate store subscribe functionality
  // it('displays "Following" button for subscriber', async () => {
  //   // Arrange
  //   ;(useResearchStore as jest.Mock).mockReturnValue({
  //     ...mockResearchStore,
  //     activeResearchItem: FactoryResearchItem({
  //       subscribers: [activeUser._id],
  //       userHasSubscribed: true,
  //     }),
  //     activeUser,
  //   })

  //   // Act
  //   let wrapper
  //   await act(async () => {
  //     wrapper = getWrapper()
  //   })
  //   const followButton = wrapper.getAllByTestId('follow-button')[0]

  //   // Assert
  //   expect(followButton).toBeInTheDocument()
  // })

  describe('Research Update', () => {
    it('displays contributors', async () => {
      // Arrange
      const researchItem = FactoryResearchItem({
        collaborators: ['example-username', 'another-example-username'],
        updates: [
          FactoryResearchItemUpdate({
            title: 'Research Update #1',
            collaborators: [
              'third-example-username',
              'fourth-example-username',
            ],
            status: 'published',
            _deleted: false,
          }),
          FactoryResearchItemUpdate({
            title: 'Research Update #2',
            collaborators: null!,
            status: 'published',
            _deleted: false,
          }),
          FactoryResearchItemUpdate({
            title: 'Research Update #3',
            collaborators: undefined,
            status: 'published',
            _deleted: false,
          }),
        ],
      })
      ;(useResearchItem as jest.Mock).mockImplementation(() => ({
        isLoading: false,
        researchItem: {
          ...researchItem,
          author: {
            userName: 'testUser',
            countryCode: 'nl',
            isVerified: true,
          },
        },
      }))

      // wait for Promise to resolve and state to update
      let wrapper
      await act(async () => {
        wrapper = getWrapper()
      })

      // Assert
      expect(wrapper.getAllByText('With contributions from:')).toHaveLength(1)
      expect(wrapper.getAllByText('example-username')).toHaveLength(2)
      expect(wrapper.getAllByText('another-example-username')).toHaveLength(2)
      expect(wrapper.getAllByText('third-example-username')).toHaveLength(1)
      expect(wrapper.queryByText('fourth-example-username')).toBeNull()
      expect(wrapper.getAllByTestId('collaborator/creator')).toHaveLength(1)
      expect(
        wrapper.getAllByTestId('Username: known flag').length,
      ).toBeGreaterThanOrEqual(5)
    })
  })

  it('shows only published updates', async () => {
    // Arrange
    const researchItem = FactoryResearchItem({
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
    })

    ;(useResearchItem as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      researchAuthor: {
        userName: 'testUser',
        countryCode: 'nl',
        isVerified: true,
      },
      researchItem,
    }))

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
  ;(useResearchStore as jest.Mock).mockReturnValue({
    ...mockResearchStore,
  })
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
