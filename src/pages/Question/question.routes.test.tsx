/* eslint-disable max-classes-per-file */
jest.mock('../../stores/common/module.store')
jest.mock('src/utils/validators')

import '@testing-library/jest-dom'

import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { faker } from '@faker-js/faker'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'mobx-react'
import { UserRole } from 'oa-shared'
import { questionService } from 'src/pages/Question/question.service'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { FactoryDiscussion } from 'src/test/factories/Discussion'
import { FactoryQuestionItem } from 'src/test/factories/Question'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

import { questionRouteElements } from './question.routes'

import type { QuestionStore } from 'src/stores/Question/question.store'

const Theme = testingThemeStyles
let mockActiveUser = FactoryUser()
const mockDiscussionItem = FactoryDiscussion()

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
jest.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        user: mockActiveUser,
      },
      aggregationsStore: {
        isVerified: jest.fn(),
        users_verified: {
          HowtoAuthor: true,
        },
      },
      howtoStore: {},
      tagsStore: {
        allTags: [
          {
            label: 'test tag 1',
            image: 'test img',
          },
        ],
      },
      questionCategoriesStore: {
        allQuestionCategories: [],
      },
      discussionStore: {
        fetchOrCreateDiscussionBySource: jest.fn().mockResolvedValue({
          mockDiscussionItem,
        }),
        activeUser: jest.fn().mockResolvedValue(mockActiveUser),
      },
    },
  }),
}))

const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
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
  fetchQuestionBySlug = jest.fn()
  votedUsefulCount = 0
  subscriberCount = 0
  userCanEditQuestion = true
}

const mockQuestionService: typeof questionService = {
  getQuestionCategories: jest.fn(() => {
    return new Promise((resolve) => {
      resolve([])
    })
  }),
  search: jest.fn(() => {
    return new Promise((resolve) => {
      resolve({ items: [], total: 0, lastVisible: undefined })
    })
  }),
}
const mockQuestionStore = new mockQuestionStoreClass()

jest.mock('src/stores/Question/question.store')
jest.mock('src/stores/Discussions/discussions.store')
jest.mock('src/pages/Question/question.service')

describe('question.routes', () => {
  beforeEach(() => {
    ;(useQuestionStore as jest.Mock).mockReturnValue(mockQuestionStore)
    questionService.getQuestionCategories = jest.fn().mockResolvedValue([])
  })

  afterEach(() => {
    jest.restoreAllMocks()
    cleanup()
  })

  describe('/questions/', () => {
    it('renders a loading state', async () => {
      let wrapper
      mockQuestionService.search = jest.fn(() => {
        return new Promise((resolve) => {
          setTimeout(
            () => resolve({ items: [], total: 0, lastVisible: undefined }),
            4000,
          )
        })
      })

      await act(async () => {
        wrapper = (await renderFn('/questions')).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })
    })

    it('renders an empty state', async () => {
      let wrapper

      await act(async () => {
        wrapper = (await renderFn('/questions')).wrapper
      })

      await waitFor(async () => {
        expect(
          wrapper.getByText(/Ask your questions and help others out/),
        ).toBeInTheDocument()

        expect(
          wrapper.getByText(/No questions have been asked yet/),
        ).toBeInTheDocument()
        expect(
          wrapper.getByRole('link', { name: 'Ask a question' }),
        ).toHaveAttribute('href', '/questions/create')
      })
    })

    it('renders the question listing', async () => {
      let wrapper
      const questionTitle = faker.lorem.words(3)
      const questionSlug = faker.lorem.slug()

      questionService.search = jest.fn(() => {
        return new Promise((resolve) => {
          resolve({
            items: [
              {
                ...FactoryQuestionItem({
                  title: questionTitle,
                  slug: questionSlug,
                }),
                _id: '123',
              },
            ],
            total: 1,
            lastVisible: undefined,
          })
        })
      })

      await act(async () => {
        wrapper = (await renderFn('/questions')).wrapper
      })

      await waitFor(async () => {
        expect(
          wrapper.getByText(/Ask your questions and help others out/),
        ).toBeInTheDocument()

        expect(wrapper.getByText(questionTitle)).toBeInTheDocument()
      })
    })
  })

  describe('/questions/create', () => {
    it('allows user to create a question', async () => {
      let wrapper
      // Arrange
      const mockUpsertQuestion = jest.fn().mockResolvedValue({
        slug: 'question-title',
      })
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        upsertQuestion: mockUpsertQuestion,
        activeUser: mockActiveUser,
      })

      await act(async () => {
        const render = await renderFn('/questions/create')
        wrapper = render.wrapper
      })

      // Fill in form
      const title = wrapper.getByLabelText('The Question', { exact: false })
      const description = wrapper.getByLabelText('Description', {
        exact: false,
      })
      const submitButton = wrapper.getByText('Publish')

      // Submit form
      await userEvent.type(title, 'Can you build a house out of plastic?')
      await userEvent.type(description, "So I've got all this plastic...")

      await waitFor(() => {
        submitButton.click()
      })

      expect(mockUpsertQuestion).toHaveBeenCalledWith({
        title: 'Can you build a house out of plastic?',
        description: "So I've got all this plastic...",
        tags: {},
      })

      expect(mockedUsedNavigate).toBeCalledWith('/questions/question-title')
    })
  })

  describe('/questions/:slug', () => {
    it('renders the question single page', async () => {
      let wrapper
      const question = FactoryQuestionItem()
      const activeUser = FactoryUser({})
      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
      const mockIncrementViewCount = jest.fn()
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        activeUser,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
        activeUser: mockActiveUser,
        incrementViewCount: mockIncrementViewCount,
      })

      await act(async () => {
        wrapper = (await renderFn(`/questions/${question.slug}`)).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      await waitFor(async () => {
        expect(() => wrapper.getByText(/loading/)).toThrow()
        expect(wrapper.queryByTestId('question-title')).toHaveTextContent(
          question.title,
        )
        expect(
          wrapper.getByText(
            new RegExp(`^${question.description.split(' ')[0]}`),
          ),
        ).toBeInTheDocument()

        // Content statistics
        expect(wrapper.getByText(`0 views`)).toBeInTheDocument()
        expect(wrapper.getByText(`0 following`)).toBeInTheDocument()
        expect(wrapper.getByText(`0 useful`)).toBeInTheDocument()

        expect(mockFetchQuestionBySlug).toBeCalledWith(question.slug)
        expect(mockIncrementViewCount).toBeCalledWith(question)
      })
    })

    describe('Follow', () => {
      it('displays following status', async () => {
        let wrapper
        const user = FactoryUser()
        const question = FactoryQuestionItem({
          subscribers: [user.userName],
        })
        const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
        useQuestionStore.mockReturnValue({
          ...mockQuestionStore,
          activeUser: user,
          fetchQuestionBySlug: mockFetchQuestionBySlug,
          userHasSubscribed: true,
        })

        await act(async () => {
          wrapper = (await renderFn(`/questions/${question.slug}`)).wrapper
        })

        await waitFor(() => {
          expect(wrapper.getByText('Following')).toBeInTheDocument()
        })
      })

      it('supports follow behaviour', async () => {
        let wrapper
        const question = FactoryQuestionItem()
        const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
        useQuestionStore.mockReturnValue({
          ...mockQuestionStore,
          fetchQuestionBySlug: mockFetchQuestionBySlug,
        })

        await act(async () => {
          wrapper = (await renderFn(`/questions/${question.slug}`)).wrapper
        })

        expect(wrapper.getByText('Follow')).toBeInTheDocument()
      })
    })

    it('does not show edit call to action', async () => {
      let wrapper
      mockActiveUser = FactoryUser()
      const question = FactoryQuestionItem()
      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)
      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
        activeUser: mockActiveUser,
        userCanEditQuestion: false,
      })

      await act(async () => {
        wrapper = (await renderFn(`/questions/${question.slug}`)).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      // Ability to edit
      await waitFor(async () => {
        expect(() => wrapper.getByText(/Edit/)).toThrow()
      })
    })

    it('shows edit call to action', async () => {
      let wrapper
      mockActiveUser = FactoryUser()
      const question = FactoryQuestionItem({
        _createdBy: mockActiveUser.userName,
      })

      const mockFetchQuestionBySlug = jest.fn().mockResolvedValue(question)

      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
        activeUser: mockActiveUser,
      })

      await act(async () => {
        wrapper = (await renderFn(`/questions/${question.slug}`)).wrapper
        expect(wrapper.getByText(/loading/)).toBeInTheDocument()
      })

      // Ability to edit
      await waitFor(async () => {
        expect(wrapper.getByText(/Edit/)).toBeInTheDocument()
      })
    })
  })

  describe('/questions/:slug/edit', () => {
    const editFormTitle = /Edit your question/
    it('renders the question edit page', async () => {
      let wrapper
      await act(async () => {
        wrapper = (await renderFn('/questions/slug/edit')).wrapper
      })

      await waitFor(async () => {
        expect(wrapper.getByText(editFormTitle)).toBeInTheDocument()
      })
    })

    it('allows admin access', async () => {
      let wrapper

      mockActiveUser = FactoryUser({
        userName: 'not-author',
        userRoles: [UserRole.ADMIN],
      })

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
        fetchQuestionBySlug: jest.fn().mockResolvedValue(questionItem),
        upsertQuestion: mockUpsertQuestion,
        activeUser: mockActiveUser,
      })

      await act(async () => {
        const res = await renderFn('/questions/slug/edit')
        wrapper = res.wrapper
      })

      await waitFor(async () => {
        await new Promise((r) => setTimeout(r, 500))
        expect(wrapper.getByText(editFormTitle)).toBeInTheDocument()
        expect(screen.getByDisplayValue(questionItem.title)).toBeInTheDocument()
        expect(() => wrapper.getByText('Draft')).toThrow()
      })
      // Fill in form
      const title = wrapper.getByLabelText('The Question', { exact: false })
      const description = wrapper.getByLabelText('Description', {
        exact: false,
      })
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
          _createdBy: 'author',
        }),
      )
    })

    it('redirects non-author', async () => {
      let wrapper
      mockActiveUser = FactoryUser({ userName: 'not-author' })

      useQuestionStore.mockReturnValue({
        ...mockQuestionStore,
        fetchQuestionBySlug: jest.fn().mockResolvedValue(
          FactoryQuestionItem({
            slug: 'slug',
            _createdBy: 'author',
          }),
        ),
        activeUser: mockActiveUser,
      })

      await act(async () => {
        const res = await renderFn('/questions/slug/edit')
        wrapper = res.wrapper
      })

      await waitFor(async () => {
        expect(() => wrapper.getByText(editFormTitle)).toThrow()
        expect(mockedUsedNavigate).toBeCalledWith('/questions/slug')
      })
    })
  })
})

const renderFn = async (url) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/questions">{questionRouteElements}</Route>,
    ),
    {
      initialEntries: [url],
    },
  )

  return {
    wrapper: render(
      <Provider
        userStore={{ user: mockActiveUser }}
        questionStore={{ foo: 'bar' }}
        tagsStore={{}}
      >
        <ThemeProvider theme={Theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>,
    ),
  }
}
