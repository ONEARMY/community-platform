import '@testing-library/jest-dom/vitest'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import { createRoutesFromElements, Route } from '@remix-run/react'
import { act, render, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { UserRole } from 'oa-shared'
import { FactoryQuestionItem } from 'src/test/factories/Question'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { QuestionPage } from './QuestionPage'

import type { Question } from 'oa-shared'

const Theme = testingThemeStyles

const activeUser = FactoryUser({
  userRoles: [UserRole.BETA_TESTER],
})

const mockUser = FactoryUser()
const mockQuestionItem = FactoryQuestionItem({
  slug: 'testSlug',
})

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserByUsername: vi.fn().mockResolvedValue(mockUser),
      },
    },
  }),
}))

vi.mock('src/stores/Question/question.store')
vi.mock('src/stores/Discussions/discussions.store')

describe('Questions', () => {
  afterEach(() => {
    // Clear all mocks after each test to ensure there's no leakage between tests
    vi.clearAllMocks()
  })

  describe('Breadcrumbs', () => {
    it('displays breadcrumbs with category', async () => {
      // Arrange
      mockQuestionItem.title =
        'Do you prefer camping near a lake or in a forest?'
      mockQuestionItem.category = {
        createdAt: new Date(),
        modifiedAt: null,
        name: 'Preference',
        id: faker.number.int(),
        type: 'questions',
      }

      // Act
      let wrapper
      act(() => {
        wrapper = getWrapper(mockQuestionItem)
      })

      // Assert: Check the breadcrumb items and chevrons
      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(3)
        expect(breadcrumbItems[0]).toHaveTextContent('Question')
        expect(breadcrumbItems[1]).toHaveTextContent('Preference')
        expect(breadcrumbItems[2]).toHaveTextContent(
          'Do you prefer camping near a lake or in a forest?',
        )

        // Assert: Check that the first two breadcrumb items contain links
        const firstLink = within(breadcrumbItems[0]).getByRole('link')
        const secondLink = within(breadcrumbItems[1]).getByRole('link')
        expect(firstLink).toBeInTheDocument()
        expect(secondLink).toBeInTheDocument()

        // Assert: Check for the correct number of chevrons
        const chevrons = wrapper.getAllByTestId('breadcrumbsChevron')
        expect(chevrons).toHaveLength(2)
      })
    })

    it('displays breadcrumbs without category', async () => {
      // Arrange
      mockQuestionItem.title =
        'Do you prefer camping near a lake or in a forest?'
      mockQuestionItem.category = null

      // Act
      let wrapper
      act(() => {
        wrapper = getWrapper(mockQuestionItem)
      })

      // Assert: Check the breadcrumb items and chevrons
      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(2)
        expect(breadcrumbItems[0]).toHaveTextContent('Question')
        expect(breadcrumbItems[1]).toHaveTextContent(
          'Do you prefer camping near a lake or in a forest?',
        )

        // Assert: Check that the first breadcrumb item contains a link
        const firstLink = within(breadcrumbItems[0]).getByRole('link')
        expect(firstLink).toBeInTheDocument()

        // Assert: Check for the correct number of chevrons
        const chevrons = wrapper.getAllByTestId('breadcrumbsChevron')
        expect(chevrons).toHaveLength(1)
      })
    })
  })
})

const getWrapper = (question: Question) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route
        path="/questions/:slug"
        key={1}
        element={<QuestionPage question={question} />}
      />,
    ),
    {
      initialEntries: ['/questions/question'],
    },
  )

  return render(
    <Provider
      userStore={{
        user: activeUser,
      }}
    >
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
