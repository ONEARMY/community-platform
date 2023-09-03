import '@testing-library/jest-dom'
import ResearchRoutes from './research.routes'
import { cleanup, render, waitFor, act } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { createMemoryHistory } from 'history'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import type { ResearchStore } from 'src/stores/Research/research.store'
import { useResearchStore } from 'src/stores/Research/research.store'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
const Theme = testingThemeStyles

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        fetchAllVerifiedUsers: jest.fn(),
      },
      aggregationsStore: {
        aggregations: {},
      },
      researchCategoriesStore: {
        allResearchCategories: [],
      },
    },
  }),
}))

/** When mocking research routes replace default store methods with below */
class mockResearchStoreClass implements Partial<ResearchStore> {
  setActiveResearchItemBySlug = jest.fn()
  needsModeration = jest.fn().mockResolvedValue(true)
  incrementViewCount = jest.fn()
  activeResearchItem = FactoryResearchItem({
    title: 'Research article title',
    updates: [],
    _createdBy: 'jasper',
  })
  researchUploadStatus = {} as any
  updateUploadStatus = {} as any
  formatResearchCommentList = jest.fn()
  getActiveResearchUpdateComments = jest.fn()
  lockResearchItem = jest.fn()
  lockResearchUpdate = jest.fn()
  unlockResearchUpdate = jest.fn()

  get activeUser() {
    return {
      name: 'Jaasper',
      userName: 'jasper',
      userRoles: ['admin'],
    } as any
  }
  get filteredResearches() {
    return []
  }
}
const mockResearchStore = new mockResearchStoreClass()

jest.mock('src/stores/Research/research.store')

describe('research.routes', () => {
  beforeEach(() => {
    ;(useResearchStore as jest.Mock).mockReturnValue(mockResearchStore)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    cleanup()
  })

  describe('/research/', () => {
    it('renders the research listing', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/research')).wrapper
      })

      await waitFor(
        () =>
          expect(
            wrapper.getByText(/Help out with Research & Development/),
          ).toBeInTheDocument(),
        {
          timeout: 2000,
        },
      )
    })
  })

  describe('/research/:slug', () => {
    it('renders an individual research article', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/research/research-slug')).wrapper
      })

      await waitFor(
        () => {
          expect(
            mockResearchStore.setActiveResearchItemBySlug,
          ).toHaveBeenCalledWith('research-slug')
          expect(
            wrapper.getByText(/Research article title/),
          ).toBeInTheDocument()
        },
        {
          timeout: 2000,
        },
      )
    })
  })

  describe('/research/create', () => {
    it('rejects a request without a user present', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/research/create')).wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(/role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('rejects a logged in user missing required role', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/research/create')).wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(/role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accepts a logged in user with required role [research_creator]', async () => {
      let wrapper
      await act(async () => {
        wrapper = (
          await renderFn(
            '/research/create',
            FactoryUser({
              userRoles: ['research_creator'],
            }),
          )
        ).wrapper
      })

      await waitFor(
        () => {
          expect(wrapper.getByText(/start your research/i)).toBeInTheDocument()
        },
        {
          timeout: 2000,
        },
      )
    })

    it('accepts a logged in user with required role [research_creator]', async () => {
      let wrapper
      await act(async () => {
        wrapper = (
          await renderFn(
            '/research/create',
            FactoryUser({
              userRoles: ['research_editor'],
            }),
          )
        ).wrapper
      })
      await waitFor(
        () => {
          expect(wrapper.getByText(/start your research/i)).toBeInTheDocument()
        },
        {
          timeout: 2000,
        },
      )
    })
  })

  describe('/research/:slug/edit', () => {
    it('rejects a request without a user present', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/research/an-example/edit', {})).wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(/role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accepts a logged in user with required role', async () => {
      let wrapper
      await act(async () => {
        wrapper = (
          await renderFn(
            '/research/an-example/edit',
            FactoryUser({
              userName: 'Jaasper',
              userRoles: ['research_editor'],
            }),
          )
        ).wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByText(/edit your research/i)).toBeInTheDocument()
      })
    })

    it('rejects a logged in user with required role but not author of document', async () => {
      const activeUser = FactoryUser({
        userRoles: ['research_editor'],
      })
      // Arrange
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: undefined,
          slug: 'an-example',
        }),
      })

      let history
      await act(async () => {
        history = (await renderFn('/research/an-example/edit', activeUser))
          .history
      })

      await waitFor(() => {
        expect(history.location.pathname).toBe('/research/an-example')
      })
    })

    it('blocks a valid editor when document is locked by another user', async () => {
      const activeUser = FactoryUser({
        userRoles: ['research_editor'],
      })

      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [activeUser.userName],
          slug: 'research-slug',
          locked: {
            by: 'jasper', // user_id
            at: new Date().toISOString(),
          },
        }),
      })

      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/research/an-example/edit', activeUser))
          .wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(
            'The research description is currently being edited by another editor.',
          ),
        ).toBeInTheDocument()
      })
    })

    it('accepts a user when document is mark locked by them', async () => {
      const activeUser = FactoryUser({
        userRoles: ['research_editor'],
      })
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [activeUser.userName],
          slug: 'research-slug',
          locked: {
            by: activeUser.userName,
            at: new Date().toISOString(),
          },
        }),
      })

      let wrapper
      act(async () => {
        wrapper = (await renderFn('/research/an-example/edit', activeUser))
          .wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByText('Edit your Research')).toBeInTheDocument()
      })
    })

    it('accepts a user with required role and contributor acccess', async () => {
      const activeUser = FactoryUser({
        userRoles: ['research_editor'],
      })
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [activeUser.userName],
          slug: 'research-slug',
        }),
      })

      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/research/an-example/edit', activeUser))
          .wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByText(/edit your research/i)).toBeInTheDocument()
      })
    })
  })

  describe('/research/:slug/new-update', () => {
    it('rejects a request without a user present', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/research/an-example/new-update', {}))
          .wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(/role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accepts a logged in user with required role', async () => {
      let wrapper
      await act(async () => {
        wrapper = (
          await renderFn(
            '/research/an-example/new-update',
            FactoryUser({ userRoles: ['research_editor'] }),
          )
        ).wrapper
      })
      await waitFor(() => {
        expect(wrapper.getByTestId('EditResearchUpdate')).toBeInTheDocument()
      })
    })
  })

  describe('/research/:slug/edit-update/:id', () => {
    it('rejects a request without a user present', async () => {
      let wrapper
      await act(async () => {
        wrapper = (
          await renderFn(
            '/research/an-example/edit-update/nested-research-update',
          )
        ).wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(/role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accept logged in author present', async () => {
      const activeUser = FactoryUser({
        userRoles: ['research_editor'],
      })
      // Arrange
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: undefined,
          _createdBy: activeUser.userName,
          slug: 'an-example',
          updates: [
            FactoryResearchItemUpdate({
              _id: 'nested-research-update',
            }),
          ],
        }),
      })

      let wrapper
      await act(async () => {
        wrapper = (
          await renderFn(
            '/research/an-example/edit-update/nested-research-update',
            activeUser,
          )
        ).wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByTestId(/EditResearchUpdate/i)).toBeInTheDocument()
      })
    })

    it('blocks valid author when document is locked', async () => {
      // Arrange
      const activeUser = FactoryUser({
        userRoles: ['research_editor'],
      })
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: undefined,
          _createdBy: activeUser.userName,
          slug: 'an-example',
          updates: [
            FactoryResearchItemUpdate({
              _id: 'nested-research-update',
              locked: {
                by: 'jasper', // user_id
                at: new Date().toISOString(),
              },
            }),
          ],
        }),
      })

      const { wrapper } = await renderFn(
        '/research/an-example/edit-update/nested-research-update',
        activeUser,
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(
            /This research update is currently being edited by another editor/,
          ),
        ).toBeInTheDocument()
      })
    })

    it('accepts a user when document is mark locked by them', async () => {
      const activeUser = FactoryUser({
        userRoles: ['research_editor'],
      })

      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [activeUser.userName],
          slug: 'research-slug',
          updates: [
            FactoryResearchItemUpdate({
              _id: 'nested-research-update',
              locked: {
                by: activeUser.userName,
                at: new Date().toISOString(),
              },
            }),
          ],
        }),
      })

      const { wrapper } = await renderFn(
        '/research/an-example/edit-update/nested-research-update',
        activeUser,
      )

      await waitFor(() => {
        expect(wrapper.getByText('Edit your update')).toBeInTheDocument()
      })
    })

    it('rejects logged in user who is not author', async () => {
      let wrapper
      await act(async () => {
        wrapper = (
          await renderFn(
            '/research/an-example/edit-update/nested-research-update',
            FactoryUser(),
          )
        ).wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(/role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accept logged in user who is collaborator', async () => {
      const activeUser = FactoryUser({
        userRoles: ['research_editor'],
      })
      // Arrange
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [activeUser.userName],
          slug: 'an-example',
          updates: [
            FactoryResearchItemUpdate({
              _id: 'nested-research-update',
            }),
          ],
        }),
      })

      let wrapper
      await act(async () => {
        wrapper = (
          await renderFn(
            '/research/an-example/edit-update/nested-research-update',
            activeUser,
          )
        ).wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByTestId(/EditResearchUpdate/i)).toBeInTheDocument()
      })
    })
  })
})

const renderFn = async (url, fnUser?) => {
  const localUser = fnUser || FactoryUser()
  const history = createMemoryHistory({
    initialEntries: [url],
  })
  return {
    wrapper: render(
      <Provider
        userStore={{ user: localUser }}
        tagsStore={{
          setTagsCategory: jest.fn(),
        }}
      >
        <ThemeProvider theme={Theme}>
          <Router history={history}>
            <ResearchRoutes />
          </Router>
        </ThemeProvider>
      </Provider>,
    ),
    history,
  }
}
