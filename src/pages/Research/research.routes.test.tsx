import '@testing-library/jest-dom'

import { Suspense } from 'react'
import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { UserRole } from 'oa-shared'
import { useResearchStore } from 'src/stores/Research/research.store'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

import { researchRouteElements } from './research.routes'

import type { ResearchStore } from 'src/stores/Research/research.store'

const Theme = testingThemeStyles
const mockActiveUser = FactoryUser()

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
jest.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        fetchAllVerifiedUsers: jest.fn(),
        user: mockActiveUser,
      },
      aggregationsStore: {
        aggregations: {},
      },
      researchCategoriesStore: {
        allResearchCategories: [],
      },
      tagsStore: {},
    },
  }),
}))

const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}))

/** When mocking research routes replace default store methods with below */
class MockResearchStoreClass implements Partial<ResearchStore> {
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
  unlockResearchItem = jest.fn()

  get activeUser() {
    return {
      name: 'Jaasper',
      userName: 'jasper',
      userRoles: [UserRole.ADMIN],
    } as any
  }
  get filteredResearches() {
    return []
  }
}
const mockResearchStore = new MockResearchStoreClass()

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
        wrapper = renderFn('/research').wrapper
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
        wrapper = renderFn('/research/research-slug').wrapper
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
      mockActiveUser.userRoles = []
      let wrapper
      await act(async () => {
        wrapper = renderFn('/research/create').wrapper
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
        wrapper = renderFn('/research/create').wrapper
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
        mockActiveUser.userRoles = [UserRole.RESEARCH_CREATOR]

        wrapper = renderFn('/research/create').wrapper
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
        mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]

        wrapper = renderFn('/research/create').wrapper
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
      mockActiveUser.userRoles = []

      let wrapper
      await act(async () => {
        wrapper = renderFn('/research/an-example/edit').wrapper
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
        mockActiveUser.userName = 'Jaasper'
        mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]

        wrapper = renderFn('/research/an-example/edit').wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByText(/edit your research/i)).toBeInTheDocument()
      })
    })

    it('rejects a logged in user with required role but not author of document', async () => {
      mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]

      // Arrange
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser: mockActiveUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: undefined,
          slug: 'an-example',
        }),
      })

      await act(async () => {
        renderFn('/research/an-example/edit')
      })

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/research/an-example')
      })
    })

    it('blocks a valid editor when document is locked by another user', async () => {
      mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser: mockActiveUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [mockActiveUser.userName],
          slug: 'research-slug',
          locked: {
            by: 'jasper', // user_id
            at: new Date().toISOString(),
          },
        }),
      })

      let wrapper
      await act(async () => {
        wrapper = renderFn('/research/an-example/edit').wrapper
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
      mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser: mockActiveUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [mockActiveUser.userName],
          slug: 'research-slug',
          locked: {
            by: mockActiveUser.userName,
            at: new Date().toISOString(),
          },
        }),
      })

      let wrapper
      await act(async () => {
        wrapper = renderFn('/research/an-example/edit').wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByText('Edit your Research')).toBeInTheDocument()
      })
    })

    it('accepts a user with required role and contributor acccess', async () => {
      mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser: mockActiveUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [mockActiveUser.userName],
          slug: 'research-slug',
        }),
      })

      let wrapper
      await act(async () => {
        wrapper = renderFn('/research/an-example/edit').wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByText(/edit your research/i)).toBeInTheDocument()
      })
    })
  })

  describe('/research/:slug/new-update', () => {
    it('rejects a request without a user present', async () => {
      mockActiveUser.userRoles = []

      let wrapper
      await act(async () => {
        wrapper = renderFn('/research/an-example/new-update').wrapper
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
        mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]

        wrapper = renderFn('/research/an-example/new-update').wrapper
      })
      await waitFor(() => {
        expect(wrapper.getByTestId('EditResearchUpdate')).toBeInTheDocument()
      })
    })
  })

  describe('/research/:slug/edit-update/:id', () => {
    it('rejects a request without a user present', async () => {
      mockActiveUser.userRoles = []
      let wrapper
      await act(async () => {
        wrapper = renderFn(
          '/research/an-example/edit-update/nested-research-update',
        ).wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(/role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accept logged in author present', async () => {
      mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]
      // Arrange
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser: mockActiveUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: undefined,
          _createdBy: mockActiveUser.userName,
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
        wrapper = renderFn(
          '/research/an-example/edit-update/nested-research-update',
        ).wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByTestId(/EditResearchUpdate/i)).toBeInTheDocument()
      })
    })

    it('blocks valid author when document is locked', async () => {
      // Arrange
      mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser: mockActiveUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: undefined,
          _createdBy: mockActiveUser.userName,
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

      const { wrapper } = renderFn(
        '/research/an-example/edit-update/nested-research-update',
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
      mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser: mockActiveUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [mockActiveUser.userName],
          slug: 'research-slug',
          updates: [
            FactoryResearchItemUpdate({
              _id: 'nested-research-update',
              locked: {
                by: mockActiveUser.userName,
                at: new Date().toISOString(),
              },
            }),
          ],
        }),
      })

      const { wrapper } = renderFn(
        '/research/an-example/edit-update/nested-research-update',
      )

      await waitFor(() => {
        expect(wrapper.getByText('Edit your update')).toBeInTheDocument()
      })
    })

    it('rejects logged in user who is not author', async () => {
      mockActiveUser.userRoles = []

      let wrapper
      await act(async () => {
        wrapper = renderFn(
          '/research/an-example/edit-update/nested-research-update',
        ).wrapper
      })

      await waitFor(() => {
        expect(
          wrapper.getByText(/role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accept logged in user who is collaborator', async () => {
      mockActiveUser.userRoles = [UserRole.RESEARCH_EDITOR]

      // Arrange
      ;(useResearchStore as jest.Mock).mockReturnValue({
        ...mockResearchStore,
        activeUser: mockActiveUser,
        activeResearchItem: FactoryResearchItem({
          collaborators: [mockActiveUser.userName],
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
        wrapper = renderFn(
          '/research/an-example/edit-update/nested-research-update',
        ).wrapper
      })

      await waitFor(() => {
        expect(wrapper.getByTestId(/EditResearchUpdate/i)).toBeInTheDocument()
      })
    })
  })
})

const renderFn = (url: string) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/research">{researchRouteElements}</Route>,
    ),
    {
      initialEntries: [url],
    },
  )

  return {
    wrapper: render(
      <Suspense fallback={<></>}>
        <Provider userStore={{ user: mockActiveUser }} tagsStore={{}}>
          <ThemeProvider theme={Theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </Suspense>,
    ),
  }
}
