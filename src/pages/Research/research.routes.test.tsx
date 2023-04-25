import '@testing-library/jest-dom'
import ResearchRoutes from './research.routes'
import { preciousPlasticTheme } from 'oa-themes'
const Theme = preciousPlasticTheme.styles

import { ThemeProvider } from '@theme-ui/core'
import { render, waitFor, cleanup } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { createMemoryHistory } from 'history'
import type { ResearchStore } from 'src/stores/Research/research.store'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { useResearchStore } from 'src/stores/Research/research.store'
import { FactoryUser } from 'src/test/factories/User'

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
  setActiveResearchItem = jest.fn()
  needsModeration = jest.fn().mockResolvedValue(true)
  incrementViewCount = jest.fn()
  activeResearchItem = FactoryResearchItem({
    title: 'Research article title',
    updates: [],
    _createdBy: 'jasper',
  })
  researchUploadStatus = {} as any
  updateUploadStatus = {} as any
  getActiveResearchUpdateComments = jest.fn()

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
      const { wrapper } = renderFn('/research')
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
      const { wrapper } = renderFn('/research/research-slug')

      await waitFor(
        () => {
          expect(mockResearchStore.setActiveResearchItem).toHaveBeenCalledWith(
            'research-slug',
          )
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
      const { wrapper } = renderFn('/research/create')

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('rejects a logged in user missing required role', async () => {
      const { wrapper } = renderFn('/research/create')

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accepts a logged in user with required role', async () => {
      const { wrapper } = renderFn(
        '/research/create',
        FactoryUser({ userRoles: ['beta-tester'] }),
      )
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
      const { wrapper } = renderFn('/research/an-example/edit', {})

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accepts a logged in user with required role', async () => {
      const { wrapper } = renderFn(
        '/research/an-example/edit',
        FactoryUser({ userName: 'Jaasper', userRoles: ['beta-tester'] }),
      )

      await waitFor(() => {
        expect(wrapper.getByText(/edit your research/i)).toBeInTheDocument()
      })
    })

    it('rejects a logged in user with required role but not author of document', async () => {
      const activeUser = FactoryUser({
        userRoles: ['beta-tester'],
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

      const { history } = renderFn('/research/an-example/edit', activeUser)

      await waitFor(() => {
        expect(history.location.pathname).toBe('/research/an-example')
      })
    })

    it('accepts a user with required role and contributor acccess', async () => {
      const activeUser = FactoryUser({
        userRoles: ['beta-tester'],
      })
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [activeUser.userName],
          slug: 'research-slug',
        }),
      })

      const { wrapper } = renderFn('/research/an-example/edit', activeUser)

      await waitFor(() => {
        expect(wrapper.getByText(/edit your research/i)).toBeInTheDocument()
      })
    })
  })

  describe('/research/:slug/new-update', () => {
    it('rejects a request without a user present', async () => {
      const { wrapper } = renderFn('/research/an-example/new-update', {})
      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accepts a logged in user with required role', async () => {
      const { wrapper } = renderFn(
        '/research/an-example/new-update',
        FactoryUser({ userRoles: ['beta-tester'] }),
      )

      await waitFor(() => {
        expect(wrapper.getByTestId('EditResearchUpdate')).toBeInTheDocument()
      })
    })
  })

  describe('/research/:slug/edit-update/:id', () => {
    it('rejects a request without a user present', async () => {
      const { wrapper } = renderFn(
        '/research/an-example/edit-update/nested-research-update',
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accept logged in author present', async () => {
      const activeUser = FactoryUser({
        userRoles: ['beta-tester'],
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

      const { wrapper } = renderFn(
        '/research/an-example/edit-update/nested-research-update',
        activeUser,
      )

      await waitFor(() => {
        expect(wrapper.getByTestId(/EditResearchUpdate/i)).toBeInTheDocument()
      })
    })

    it('rejects logged in user who is not author', async () => {
      const { wrapper } = renderFn(
        '/research/an-example/edit-update/nested-research-update',
        FactoryUser(),
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accept logged in user who is collaborator', async () => {
      const activeUser = FactoryUser({
        userRoles: ['beta-tester'],
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

      const { wrapper } = renderFn(
        '/research/an-example/edit-update/nested-research-update',
        activeUser,
      )

      await waitFor(() => {
        expect(wrapper.getByTestId(/EditResearchUpdate/i)).toBeInTheDocument()
      })
    })
  })
})

const renderFn = (url, fnUser?) => {
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
