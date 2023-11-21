jest.mock('../../stores/common/module.store')

import '@testing-library/jest-dom'
import QuestionRoutes from './question.routes'
import { ThemeProvider } from '@emotion/react'
import { cleanup, render, waitFor, act, screen } from '@testing-library/react'
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
vi.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        fetchAllVerifiedUsers: vi.fn(),
      },
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
  setActiveQuestionItemBySlug = vi.fn()
  needsModeration = vi.fn().mockResolvedValue(true)
  incrementViewCount = vi.fn()
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
  fetchQuestionBySlug = jest.fn()
}
const mockQuestionStore = new mockQuestionStoreClass()

vi.mock('src/stores/Question/question.store')

describe('question.routes', () => {
  beforeEach(() => {
    ;(useQuestionStore as jest.Mock).mockReturnValue(mockQuestionStore)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  describe('/questions/', () => {
    it('renders a loading state', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/questions')).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      expect(() => wrapper.getByText(/loading/)).toThrow()
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
      ).toHaveAttribute('href', `/question/${questionSlug}`)
    })
  })

  describe('/questions/create', () => {
    it('allows user to create a question', async () => {
      let wrapper
      let history
      // Arrange
      const mockUpsertQuestion = jest.fn().mockResolvedValue({
        slug: 'question-title',
      })
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        upsertQuestion: mockUpsertQuestion,
      })

      await act(async () => {
        const render = await renderFn('/questions/create')
        wrapper = render.wrapper
        history = render.history
      })

      // Fill in form
      const title = wrapper.getByLabelText('The Question')
      const description = wrapper.getByLabelText('Give some more information')
      const submitButton = wrapper.getByText('Publish')

      // Submit form
      await userEvent.type(title, 'Question title')
      await userEvent.type(description, 'Question description')

      await waitFor(() => {
        submitButton.click()
      })

      expect(mockUpsertQuestion).toHaveBeenCalledWith({
        title: 'Question title',
        description: 'Question description',
      })

      expect(history.location.pathname).toBe('/question/question-title')
    })
  })

  describe('/question/:slug', () => {
    it('renders the question single page', async () => {
      let wrapper
      const question = FactoryQuestionItem()
      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
      })

      await act(async () => {
        wrapper = (await renderFn(`/question/${question.slug}`)).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      expect(() => wrapper.getByText(/loading/)).toThrow()
      expect(wrapper.getByText(question.title)).toBeInTheDocument()
      expect(
        wrapper.getByText(new RegExp(`^${question.description.split(' ')[0]}`)),
      ).toBeInTheDocument()
      expect(mockFetchQuestionBySlug).toBeCalledWith(question.slug)
    })

    it('does not show Edit call to action', async () => {
      let wrapper
      const question = FactoryQuestionItem()
      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
      })

      await act(async () => {
        wrapper = (await renderFn(`/question/${question.slug}`, FactoryUser()))
          .wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      // Ability to edit
      expect(() => wrapper.getByText(/Edit/)).toThrow()
    })

    it('shows Edit call to action', async () => {
      let wrapper
      const activeUser = FactoryUser({})
      const question = FactoryQuestionItem({
        _createdBy: activeUser.userName,
      })
      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        activeUser,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
      })

      await act(async () => {
        wrapper = (await renderFn(`/question/${question.slug}`, FactoryUser()))
          .wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      // Ability to edit
      expect(wrapper.getByText(/Edit/)).toBeInTheDocument()
    })
  })

  describe('/question/:slug/edit', () => {
    const editFormTitle = /Edit your question/
    it('renders the question edit page', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/question/slug/edit')).wrapper
      })

      expect(wrapper.getByText(editFormTitle)).toBeInTheDocument()
    })

    it('allows admin access', async () => {
      let wrapper

      const questionItem = FactoryQuestionItem({
        slug: 'slug',
        title: faker.lorem.words(1),
        _createdBy: 'author',
      })
      const mockUpsertQuestion = jest.fn().mockResolvedValue({
        slug: 'question-title',
      })

      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        activeUser: FactoryUser({
          userName: 'not-author',
          userRoles: ['admin'],
        }),
        fetchQuestionBySlug: jest.fn().mockResolvedValue(questionItem),
        upsertQuestion: mockUpsertQuestion,
      })

      await act(async () => {
        const res = await renderFn('/question/slug/edit', FactoryUser())
        wrapper = res.wrapper
      })

      expect(wrapper.getByText(editFormTitle)).toBeInTheDocument()
      expect(screen.getByDisplayValue(questionItem.title)).toBeInTheDocument()
      expect(() => wrapper.getByText('Draft')).toThrow()

      // Fill in form
      const title = wrapper.getByLabelText('The Question')
      const description = wrapper.getByLabelText('Give some more information')
      const submitButton = wrapper.getByText('Update')

      // Submit form
      await userEvent.clear(title)
      await userEvent.type(title, 'Question title')
      await userEvent.clear(description)
      await userEvent.type(description, 'Question description')

      await waitFor(() => {
        submitButton.click()
      })

      expect(mockUpsertQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Question title',
          description: 'Question description',
        }),
      )
    })

    it('redirects non-author', async () => {
      let wrapper
      let history

      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        activeUser: FactoryUser({ userName: 'not-author' }),
        fetchQuestionBySlug: jest.fn().mockResolvedValue(
          FactoryQuestionItem({
            slug: 'slug',
            _createdBy: 'author',
          }),
        ),
      })

      await act(async () => {
        const res = await renderFn('/question/slug/edit', FactoryUser())
        wrapper = res.wrapper
        history = res.history
      })

      expect(() => wrapper.getByText(editFormTitle)).toThrow()
      expect(history.location.pathname).toBe('/question/slug')
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
        questionStore={{ foo: 'bar' }}
        tagsStore={{
          setTagsCategory: vi.fn(),
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
