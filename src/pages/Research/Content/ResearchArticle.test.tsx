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
import { FactoryComment } from 'src/test/factories/Comment'
const Theme = testingThemeStyles

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
        aggregations: {},
      },
    },
  }),
}))

jest.mock('src/stores/Research/research.store')

describe('Research Article', () => {
  const mockResearchStore = {
    activeResearchItem: FactoryResearchItem(),
    setActiveResearchItemBySlug: jest.fn().mockResolvedValue(true),
    addSubscriberToResearchArticle: jest.fn(),
    needsModeration: jest.fn(),
    formatResearchCommentList: jest.fn(),
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
    expect(wrapper.getAllByText('example-username')).toHaveLength(2)
    expect(wrapper.getAllByText('another-example-username')).toHaveLength(2)
    expect(wrapper.getAllByTestId('Username: known flag')).toHaveLength(4)
  })

  it('displays "Follow" button for non-subscriber', async () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
      activeResearchItem: FactoryResearchItem({
        userHasSubscribed: false,
      }),
      activeUser,
    })

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
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeResearchItem: FactoryResearchItem({
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
        }),
      })

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
      expect(wrapper.getAllByTestId('Username: known flag')).toHaveLength(5)
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

  it('shows comments for a research update', async () => {
    // Arrange
    ;(useResearchStore as jest.Mock).mockReturnValue({
      ...mockResearchStore,
      formatResearchCommentList: jest.fn().mockImplementation((c) => {
        return c
      }),
      activeResearchItem: FactoryResearchItem({
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
          FactoryResearchItemUpdate({
            title: 'Research Update #3',
            status: 'published',
            _deleted: false,
            comments: [
              FactoryComment({
                text: 'First test comment',
              }),
              FactoryComment({
                text: 'Second test comment',
              }),
            ],
          }),
        ],
      }),
    })
    // Act
    let wrapper
    await act(async () => {
      wrapper = getWrapper()
      wrapper.getByText('View 2 Comments').click()
    })

    // Assert
    expect(wrapper.getByText('First test comment')).toBeInTheDocument()
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
