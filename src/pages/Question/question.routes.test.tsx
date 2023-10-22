jest.mock('../../stores/common/module.store')

import '@testing-library/jest-dom'
import QuestionRoutes from './question.routes'
import { cleanup, render, waitFor, act } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { createMemoryHistory } from 'history'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import userEvent from '@testing-library/user-event'
import type { QuestionStore } from 'src/stores/Question/question.store'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { FactoryQuestionItem } from 'src/test/factories/Question'
import { faker } from '@faker-js/faker'

const Theme = testingThemeStyles

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
jest.mock('src/index', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {},
      aggregationsStore: {
        aggregations: {
          users_totalUseful: {
            HowtoAuthor: 0,
          },
          users_verified: {
            HowtoAuthor: true,
          },
        },
      },
      howtoStore: {},
      tagsStore: {},
    },
  }),
}))

class mockQuestionStoreClass implements Partial<QuestionStore> {
  setActiveQuestionItemBySlug = jest.fn()
  needsModeration = jest.fn().mockResolvedValue(true)
  incrementViewCount = jest.fn()
  activeQuestionItem = FactoryQuestionItem({
    title: 'Question article title',
  })
  QuestionUploadStatus = {} as any
  updateUploadStatus = {} as any
  formatQuestionCommentList = jest.fn()
  getActiveQuestionUpdateComments = jest.fn()
  lockQuestionItem = jest.fn()
  lockQuestionUpdate = jest.fn()
  unlockQuestionUpdate = jest.fn()
  upsertQuestion = jest.fn()
  fetchQuestions = jest.fn().mockResolvedValue([])
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
    it.skip('renders a loading state', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/questions')).wrapper
      })

      expect(
        wrapper.getByText(/Ask your questions and help others out/),
      ).toBeInTheDocument()

      expect(wrapper.getByText(/loading/)).toBeInTheDocument()
    })

    it('renders an empty state', async () => {
      let wrapper
      ;(useQuestionStore as any).mockReturnValue({
        ...mockQuestionStore,
        fetchQuestions: jest.fn().mockResolvedValue([]),
      })

      await act(async () => {
        wrapper = (await renderFn('/questions')).wrapper
      })

      expect(
        wrapper.getByText(/Ask your questions and help others out/),
      ).toBeInTheDocument()

      expect(wrapper.getByText(/No questions yet/)).toBeInTheDocument()
      expect(
        wrapper.getByRole('link', { name: 'Ask a question' }),
      ).toHaveAttribute('href', '/questions/create')
    })

    it('renders the question listing', async () => {
      let wrapper
      const questionTitle = faker.lorem.words(3)
      const questionSlug = faker.lorem.slug()

      ;(useQuestionStore as any).mockReturnValue({
        ...mockQuestionStore,
        fetchQuestions: jest.fn().mockResolvedValue([
          {
            ...FactoryQuestionItem({
              title: questionTitle,
              slug: questionSlug,
            }),
            _id: '123',
          },
        ]),
      })

      await act(async () => {
        wrapper = (await renderFn('/questions')).wrapper
      })

      expect(
        wrapper.getByText(/Ask your questions and help others out/),
      ).toBeInTheDocument()

      expect(wrapper.getByText(questionTitle)).toBeInTheDocument()
      expect(
        wrapper.getByRole('link', {
          name: questionTitle,
        }),
      ).toHaveAttribute('href', `/questions/${questionSlug}`)
    })
  })

  describe('/questions/create', () => {
    it('allows user to create a question', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/questions/create')).wrapper
      })

      // Fill in form
      const title = wrapper.getByLabelText('The Question')
      const description = wrapper.getByLabelText('Give some more information')

      // Submit form
      const submitButton = wrapper.getByText('Publish')
      await userEvent.type(title, 'Question title')
      await userEvent.type(description, 'Question description')

      await waitFor(() => {
        submitButton.click()
      })

      expect(mockQuestionStore.upsertQuestion).toHaveBeenCalledWith({
        title: 'Question title',
        description: 'Question description',
      })
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
      <Provider userStore={{ user: localUser }} questionStore={{ foo: 'bar' }}>
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
