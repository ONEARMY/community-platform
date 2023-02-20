import '@testing-library/jest-dom'
import ResearchRoutes from './research.routes'
import Theme from 'src/themes/styled.theme'

import { ThemeProvider } from '@theme-ui/core'
import { render, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Provider } from 'mobx-react'
import type { ResearchStore } from 'src/stores/Research/research.store'

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores() {
    return {
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
    }
  },
}))

/** When mocking research routes replace default store methods with below */
class mockResearchStoreClass implements Partial<ResearchStore> {
  setActiveResearchItem = jest.fn()
  needsModeration = jest.fn().mockResolvedValue(true)
  incrementViewCount = jest.fn()
  activeResearchItem = {
    title: 'Research article title',
    updates: [],
    _createdBy: 'jasper',
  } as any
  researchUploadStatus = {} as any
  updateUploadStatus = {} as any

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

jest.mock('src/stores/Research/research.store', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useResearchStore() {
    return mockResearchStore
  },
}))

describe('research.routes', () => {
  afterEach(cleanup)

  describe('/research/', () => {
    it('renders the research listing', async () => {
      const wrapper = render(
        <Provider userStore={{}}>
          <ThemeProvider theme={Theme}>
            <MemoryRouter initialEntries={['/research']}>
              <ResearchRoutes />
            </MemoryRouter>
          </ThemeProvider>
        </Provider>,
      )
      await waitFor(
        () => expect(wrapper.getByText(/Research topic/)).toBeInTheDocument(),
        {
          timeout: 2000,
        },
      )
    })
  })

  describe('/research/:slug', () => {
    it('renders an individual research article', async () => {
      const wrapper = render(
        <Provider userStore={{}}>
          <ThemeProvider theme={Theme}>
            <MemoryRouter initialEntries={['/research/research-slug']}>
              <ResearchRoutes />
            </MemoryRouter>
          </ThemeProvider>
        </Provider>,
      )

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
      const wrapper = render(
        <Provider userStore={{}}>
          <ThemeProvider theme={Theme}>
            <MemoryRouter initialEntries={['/research/create']}>
              <ResearchRoutes />
            </MemoryRouter>
          </ThemeProvider>
        </Provider>,
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('rejects a logged in user missing required role', async () => {
      const wrapper = render(
        <Provider
          userStore={{
            user: { name: 'Jaasper' },
          }}
        >
          <MemoryRouter initialEntries={['/research/create']}>
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accepts a logged in user with required role', async () => {
      const wrapper = render(
        <Provider
          userStore={{
            user: { name: 'Jaasper', userRoles: ['beta-tester'] },
          }}
          tagsStore={{
            setTagsCategory: jest.fn(),
          }}
        >
          <ThemeProvider theme={Theme}>
            <MemoryRouter initialEntries={['/research/create']}>
              <ResearchRoutes />
            </MemoryRouter>
          </ThemeProvider>
        </Provider>,
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
      const wrapper = render(
        <Provider userStore={{}}>
          <MemoryRouter initialEntries={['/research/an-example/edit']}>
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })
    it('accepts a logged in user with required role', async () => {
      // Using a mock in this instance as testing the
      // behaviour of the edit form is out of scope. We
      // are only looking to verify that a user with
      // correct access rights has the Research.form component
      // presented to them.
      jest.doMock('src/pages/Research/Content/Common/Research.form', () => ({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __esModule: true,
        default(props) {
          return <div>{props.parentType} your research</div>
        },
      }))

      const wrapper = render(
        <Provider
          userStore={{
            user: { name: 'Jaasper', userRoles: ['beta-tester'] },
          }}
          tagsStore={{
            setTagsCategory: jest.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/research/an-example/edit']}>
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )

      await waitFor(() => {
        expect(wrapper.getByText(/edit your research/i)).toBeInTheDocument()
      })
    })
  })

  describe('/research/:slug/new-update', () => {
    it('rejects a request without a user present', async () => {
      const wrapper = render(
        <Provider userStore={{}}>
          <MemoryRouter initialEntries={['/research/an-example/new-update']}>
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('accepts a logged in user with required role', async () => {
      // Using a mock in this instance as testing the
      // behaviour of the edit form is out of scope. We
      // are only looking to verify that a user with
      // correct access rights has the Research.form component
      // presented to them.
      jest.doMock('src/pages/Research/Content/Common/Research.form', () => ({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __esModule: true,
        default(props) {
          return <div>{props.parentType} your research</div>
        },
      }))

      const wrapper = render(
        <Provider
          userStore={{
            user: { name: 'Jaasper', userRoles: ['beta-tester'] },
          }}
          tagsStore={{
            setTagsCategory: jest.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/research/an-example/new-update']}>
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )

      await waitFor(() => {
        expect(wrapper.getByText(/new update/i)).toBeInTheDocument()
      })
    })
  })

  describe('/research/:slug/edit-update', () => {
    it('rejects a request without a user present', async () => {
      const wrapper = render(
        <Provider userStore={{}}>
          <MemoryRouter
            initialEntries={[
              '/research/an-example/edit-update/nested-research-update',
            ]}
          >
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(/beta-tester role required to access this page/),
        ).toBeInTheDocument()
      })
    })

    it('logged in user present', async () => {
      // Using a mock in this instance as testing the
      // behaviour of the edit form is out of scope. We
      // are only looking to verify that a user with
      // correct access rights has the EditUpdate component
      // presented to them.
      jest.doMock('src/pages/Research/Content/EditUpdate/index.tsx', () => ({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __esModule: true,
        default() {
          return <div>Edit update within research</div>
        },
      }))

      const wrapper = render(
        <Provider
          userStore={{
            user: { name: 'Jaasper', userRoles: ['beta-tester'] },
          }}
        >
          <MemoryRouter
            initialEntries={[
              '/research/an-example/edit-update/nested-research-update',
            ]}
          >
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )

      await waitFor(() => {
        expect(
          wrapper.getByText(/Edit update within research/i),
        ).toBeInTheDocument()
      })
    })
  })
})
