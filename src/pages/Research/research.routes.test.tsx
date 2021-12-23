import '@testing-library/jest-dom'
import ResearchRoutes from './research.routes'
import { render, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Provider } from 'mobx-react'

const mockResearchStore: any = {
  filteredResearches: [],
  setActiveResearchItem: jest.fn(),
  needsModeration: jest.fn().mockResolvedValue(true),
  activeResearchItem: {
    title: 'Research article title',
    updates: [],
    _createdBy: 'jasper',
  },
  researchUploadStatus: {},
  updateUploadStatus: {},
  activeUser: {
    name: 'Jaasper',
    userName: 'jasper',
    userRoles: ['admin'],
  },
}

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
          <MemoryRouter initialEntries={['/research']}>
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )
      await waitFor(() =>
        expect(wrapper.getByText(/Research topic/)).toBeInTheDocument(),
      )
    })
  })

  describe('/research/:slug', () => {
    it('renders an individual research article', async () => {
      const wrapper = render(
        <Provider userStore={{}} themeStore={{}}>
          <MemoryRouter initialEntries={['/research/research-slug']}>
            <ResearchRoutes />
          </MemoryRouter>
        </Provider>,
      )

      await waitFor(() => {
        expect(mockResearchStore.setActiveResearchItem).toHaveBeenCalledWith(
          'research-slug',
        )
        expect(wrapper.getByText(/Research article title/)).toBeInTheDocument()
      })
    })
  })

  describe('/research/create', () => {
    it('rejects a request without a user present', async () => {
      const wrapper = render(
        <Provider userStore={{}} themeStore={{}}>
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

    it('rejects a logged in user missing required role', async () => {
      const wrapper = render(
        <Provider
          userStore={{
            user: { name: 'Jaasper' },
          }}
          themeStore={{}}
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
          themeStore={{}}
          tagsStore={{
            setTagsCategory: jest.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/research/create']}>
            <ResearchRoutes />
          </MemoryRouter>
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
        <Provider userStore={{}} themeStore={{}}>
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
          themeStore={{}}
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
        <Provider userStore={{}} themeStore={{}}>
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
          themeStore={{}}
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
        <Provider userStore={{}} themeStore={{}}>
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
          themeStore={{}}
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
