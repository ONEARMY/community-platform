import '@testing-library/jest-dom'
import QuestionRoutes from './question.routes'
import { cleanup, render, waitFor, act } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { createMemoryHistory } from 'history'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import type { QuestionStore } from 'src/stores/Question/question.store'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { FactoryQuestionItem } from 'src/test/factories/Question'
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
class mockQuestionStoreClass implements Partial<QuestionStore> {
  setActiveResearchItemBySlug = jest.fn()
  needsModeration = jest.fn().mockResolvedValue(true)
  incrementViewCount = jest.fn()
  activeResearchItem = FactoryQuestionItem({
    title: 'Question title',
    _createdBy: 'jasper',
  })
  researchUploadStatus = {} as any
  updateUploadStatus = {} as any
  formatResearchCommentList = jest.fn()

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
const mockQuestionStore = new mockQuestionStoreClass()

jest.mock('src/stores/Question/question.store')

describe('question.routes', () => {
  beforeEach(() => {
    ;(useQuestionStore as jest.Mock).mockReturnValue(mockQuestionStore)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    cleanup()
  })

  describe('/questions/', () => {
    it('renders the question listing', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/questions')).wrapper
      })

      await waitFor(
        () => expect(wrapper.getByText(/Question Listing/)).toBeInTheDocument(),
        {
          timeout: 2000,
        },
      )
    })
  })

  describe('/questions/create', () => {
    it('renders the question create page', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/questions/create')).wrapper
      })

      await waitFor(
        () => expect(wrapper.getByText(/Question Create/)).toBeInTheDocument(),
        {
          timeout: 2000,
        },
      )
    })
  })

  describe('/questions/:slug', () => {
    it('renders the question single page', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/questions/slug')).wrapper
      })

      await waitFor(
        () => expect(wrapper.getByText(/Question Single/)).toBeInTheDocument(),
        {
          timeout: 2000,
        },
      )
    })
  })

  describe('/questions/:slug/edit', () => {
    it('renders the question edit page', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/questions/slug/edit')).wrapper
      })

      await waitFor(
        () => expect(wrapper.getByText(/Question Edit/)).toBeInTheDocument(),
        {
          timeout: 2000,
        },
      )
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
            <QuestionRoutes />
          </Router>
        </ThemeProvider>
      </Provider>,
    ),
    history,
  }
}
