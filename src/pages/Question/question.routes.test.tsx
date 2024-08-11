import '@testing-library/jest-dom/vitest'

import { ThemeProvider } from '@emotion/react'
import { faker } from '@faker-js/faker'
import { createRemixStub } from '@remix-run/testing'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'mobx-react'
import { UserRole } from 'oa-shared'
import { questionService } from 'src/pages/Question/question.service'
import QuestionsLayout from 'src/routes/_.questions'
import QuestionsListing from 'src/routes/_.questions._index'
import QuestionsArticle from 'src/routes/_.questions.$slug._index'
import QuestionsEdit from 'src/routes/_.questions.$slug.edit'
import QuestionsCreate from 'src/routes/_.questions.create'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { FactoryDiscussion } from 'src/test/factories/Discussion'
import { FactoryQuestionItem } from 'src/test/factories/Question'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { QuestionStore } from 'src/stores/Question/question.store'
import type { Mock } from 'vitest'

vi.mock('../../stores/common/module.store')
vi.mock('src/utils/validators')

const Theme = testingThemeStyles
let mockActiveUser = FactoryUser()
const mockDiscussionItem = FactoryDiscussion()

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        user: mockActiveUser,
      },
      aggregationsStore: {
        isVerified: vi.fn(),
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
        fetchOrCreateDiscussionBySource: vi.fn().mockResolvedValue({
          mockDiscussionItem,
        }),
        activeUser: vi.fn().mockResolvedValue(mockActiveUser),
      },
    },
  }),
}))

const mockedUsedNavigate = vi.fn()
vi.mock('@remix-run/react', async () => ({
  ...((await vi.importActual('@remix-run/react')) as any),
  useNavigate: () => mockedUsedNavigate,
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
  formatQuestionCommentList = vi.fn()
  getActiveQuestionUpdateComments = vi.fn()
  lockQuestionItem = vi.fn()
  lockQuestionUpdate = vi.fn()
  unlockQuestionUpdate = vi.fn()
  upsertQuestion = vi.fn()
  fetchQuestions = vi.fn().mockResolvedValue([])
  fetchQuestionBySlug = vi.fn()
  votedUsefulCount = 0
  subscriberCount = 0
  userCanEditQuestion = true
}

const mockQuestionStore = new mockQuestionStoreClass()

vi.mock('src/stores/Question/question.store')
vi.mock('src/stores/Discussions/discussions.store')
vi.mock('src/pages/Question/question.service')

describe('question.routes', () => {
  beforeEach(() => {
    ;(useQuestionStore as Mock).mockReturnValue(mockQuestionStore)
    questionService.getQuestionCategories = vi.fn().mockResolvedValue([])
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  describe('/questions/', () => {
    // it('renders an empty state', async () => {
    //   let wrapper
    //   act(() => {
    //     wrapper = renderFn('/questions')
    //   })
    //   // await waitFor(() => {
    //   //   screen.getByText(/Ask your questions and help others out/)
    //   //   expect(
    //   //     wrapper.getByText(/Ask your questions and help others out/),
    //   //   ).toBeInTheDocument()
    //   //   // expect(
    //   //   //   wrapper.getByText(/No questions have been asked yet/),
    //   //   // ).toBeInTheDocument()
    //   //   // expect(
    //   //   //   wrapper.getByRole('link', { name: 'Ask a question' }),
    //   //   // ).toHaveAttribute('href', '/questions/create')
    //   // })
    // })
    // it('renders the question listing', async () => {
    //   let wrapper
    //   const questionTitle = faker.lorem.words(3)
    //   const questionSlug = faker.lorem.slug()
    //   questionService.search = vi.fn(() => {
    //     return new Promise((resolve) => {
    //       resolve({
    //         items: [
    //           {
    //             ...FactoryQuestionItem({
    //               title: questionTitle,
    //               slug: questionSlug,
    //             }),
    //             _id: '123',
    //           },
    //         ],
    //         total: 1,
    //         lastVisible: undefined,
    //       })
    //     })
    //   })
    //   act(() => {
    //     wrapper = renderFn('/questions')
    //   })
    //   await waitFor(async () => {
    //     expect(
    //       wrapper.getByText(/Ask your questions and help others out/),
    //     ).toBeInTheDocument()
    //     expect(wrapper.getByText(questionTitle)).toBeInTheDocument()
    //   })
    // })
  })

  describe('/questions/:slug', () => {
    it('renders the question single page', async () => {
      let wrapper
      const question = FactoryQuestionItem()
      const mockFetchQuestionBySlug = vi.fn().mockResolvedValue(question)
      const mockIncrementViewCount = vi.fn()

      ;(useQuestionStore as Mock).mockReturnValue({
        ...mockQuestionStore,
        fetchQuestionBySlug: mockFetchQuestionBySlug,
        activeUser: mockActiveUser,
        incrementViewCount: mockIncrementViewCount,
      })

      act(() => {
        wrapper = renderFn(`/questions/${question.slug}`)
      })
      expect(wrapper.getByText(/loading/)).toBeInTheDocument()

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

    //   describe('Follow', () => {
    //     it('displays following status', async () => {
    //       const user = FactoryUser()
    //       const question = FactoryQuestionItem({
    //         subscribers: [user.userName],
    //       })
    //       const mockFetchQuestionBySlug = vi.fn().mockResolvedValue(question)
    //       ;(useQuestionStore as Mock).mockReturnValue({
    //         ...mockQuestionStore,
    //         activeUser: user,
    //         fetchQuestionBySlug: mockFetchQuestionBySlug,
    //         userHasSubscribed: true,
    //       })

    //       let wrapper
    //       act(() => {
    //         wrapper = renderFn(`/questions/${question.slug}`)
    //       })

    //       await waitFor(
    //         () => {
    //           expect(wrapper.getByText('Following')).toBeInTheDocument()
    //         },
    //         {
    //           timeout: 2000,
    //         },
    //       )
    //     })

    //     it('supports follow behaviour', async () => {
    //       let wrapper
    //       const question = FactoryQuestionItem()
    //       const mockFetchQuestionBySlug = vi.fn().mockResolvedValue(question)
    //       ;(useQuestionStore as Mock).mockReturnValue({
    //         ...mockQuestionStore,
    //         fetchQuestionBySlug: mockFetchQuestionBySlug,
    //       })

    //       act(() => {
    //         wrapper = renderFn(`/questions/${question.slug}`)
    //       })

    //       await waitFor(
    //         () => {
    //           expect(wrapper.getByText('Follow')).toBeInTheDocument()
    //         },
    //         {
    //           timeout: 2000,
    //         },
    //       )
    //     })
    //   })

    //   it('does not show edit call to action', async () => {
    //     let wrapper
    //     mockActiveUser = FactoryUser()
    //     const question = FactoryQuestionItem()
    //     const mockFetchQuestionBySlug = vi.fn().mockResolvedValue(question)
    //     ;(useQuestionStore as Mock).mockReturnValue({
    //       ...mockQuestionStore,
    //       fetchQuestionBySlug: mockFetchQuestionBySlug,
    //       activeUser: mockActiveUser,
    //       userCanEditQuestion: false,
    //     })

    //     act(() => {
    //       wrapper = renderFn(`/questions/${question.slug}`)
    //     })

    //     // Ability to edit
    //     await waitFor(async () => {
    //       expect(() => wrapper.getByText(/Edit/)).toThrow()
    //     })
    //   })

    //   it('shows edit call to action', async () => {
    //     let wrapper
    //     mockActiveUser = FactoryUser()
    //     const question = FactoryQuestionItem({
    //       _createdBy: mockActiveUser.userName,
    //     })

    //     const mockFetchQuestionBySlug = vi.fn().mockResolvedValue(question)

    //     ;(useQuestionStore as Mock).mockReturnValue({
    //       ...mockQuestionStore,
    //       fetchQuestionBySlug: mockFetchQuestionBySlug,
    //       activeUser: mockActiveUser,
    //     })

    //     act(() => {
    //       wrapper = renderFn(`/questions/${question.slug}`)
    //     })

    //     // Ability to edit
    //     await waitFor(async () => {
    //       expect(wrapper.getByText(/Edit/)).toBeInTheDocument()
    //     })
    //   })
  })

  // describe('/questions/:slug/edit', () => {
  //   const editFormTitle = /Edit your question/
  //   it('renders the question edit page', async () => {
  //     let wrapper
  //     act(() => {
  //       wrapper = renderFn('/questions/slug/edit')
  //     })

  //     await waitFor(() => {
  //       expect(wrapper.getByText(editFormTitle)).toBeInTheDocument()
  //     })
  //   })

  //   it('allows admin access', async () => {
  //     let wrapper

  //     mockActiveUser = FactoryUser({
  //       userName: 'not-author',
  //       userRoles: [UserRole.ADMIN],
  //     })

  //     const questionItem = FactoryQuestionItem({
  //       slug: 'slug',
  //       title: faker.lorem.words(1),
  //       _createdBy: 'author',
  //     })
  //     const mockUpsertQuestion = vi.fn().mockResolvedValue({
  //       slug: 'question-title',
  //     })

  //     ;(useQuestionStore as Mock).mockReturnValue({
  //       ...mockQuestionStore,
  //       fetchQuestionBySlug: vi.fn().mockResolvedValue(questionItem),
  //       upsertQuestion: mockUpsertQuestion,
  //       activeUser: mockActiveUser,
  //     })

  //     act(() => {
  //       wrapper = renderFn('/questions/slug/edit')
  //     })

  //     await waitFor(async () => {
  //       await new Promise((r) => setTimeout(r, 500))
  //       expect(wrapper.getByText(editFormTitle)).toBeInTheDocument()
  //       expect(screen.getByDisplayValue(questionItem.title)).toBeInTheDocument()
  //       expect(() => wrapper.getByText('Draft')).toThrow()
  //     })

  //     // Fill in form
  //     const title = wrapper.getByLabelText('The Question', { exact: false })
  //     const description = wrapper.getByLabelText('Description', {
  //       exact: false,
  //     })
  //     const submitButton = wrapper.getByText('Update')

  //     // Submit form
  //     await userEvent.clear(title)
  //     await userEvent.type(title, 'Question title')
  //     await userEvent.clear(description)
  //     await userEvent.type(description, 'Question description')

  //     act(() => {
  //       submitButton.click()
  //     })

  //     expect(mockUpsertQuestion).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         title: 'Question title',
  //         description: 'Question description',
  //         _createdBy: 'author',
  //       }),
  //     )
  //   })

  //   it('redirects non-author', async () => {
  //     let wrapper
  //     mockActiveUser = FactoryUser({ userName: 'not-author' })
  //     ;(useQuestionStore as Mock).mockReturnValue({
  //       ...mockQuestionStore,
  //       fetchQuestionBySlug: vi.fn().mockResolvedValue(
  //         FactoryQuestionItem({
  //           slug: 'slug',
  //           _createdBy: 'author',
  //         }),
  //       ),
  //       activeUser: mockActiveUser,
  //     })

  //     act(() => {
  //       wrapper = renderFn('/questions/slug/edit')
  //     })

  //     await waitFor(() => {
  //       expect(() => wrapper.getByText(editFormTitle)).toThrow()
  //       expect(mockedUsedNavigate).toBeCalledWith('/questions/slug')
  //     })
  //   })
  // })
}, 15000)

const renderFn = (url: string) => {
  const RemixStub = createRemixStub(
    [
      {
        path: '/',
        Component: QuestionsLayout,
        children: [
          {
            path: '/questions',
            Component: QuestionsListing,
            index: true,
            loader: () => null,
          },
          {
            path: '/questions/create',
            Component: QuestionsCreate,
            loader: () => null,
          },
          {
            path: '/questions/:slug',
            Component: QuestionsArticle,
            loader: () => null,
          },
          {
            path: '/questions/:slug/edit',
            Component: QuestionsEdit,
            loader: () => null,
          },
        ],
        loader: () => null,
      },
    ],
    {
      initialEntries: [url],
    },
  )

  return render(
    <Provider
      userStore={{ user: mockActiveUser }}
      questionStore={{ foo: 'bar' }}
      tagsStore={{}}
    >
      <ThemeProvider theme={Theme}>
        <RemixStub />
      </ThemeProvider>
    </Provider>,
  )
}
