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
import {
  QuestionStore,
  useQuestionStore,
} from 'src/stores/Question/question.store'
import { FactoryQuestionItem } from 'src/test/factories/Question'

const Theme = testingThemeStyles

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
jest.mock('src/index', () => ({
  __esModule: true,
  useCommonStores: () => ({
    questionStore: {
      // mock store values and methods
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
