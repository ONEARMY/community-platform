import '@testing-library/jest-dom/vitest'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { createRoutesFromElements, Route } from '@remix-run/react'
import { act, render, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { UserRole } from 'oa-shared'
import { FactoryNewsItem } from 'src/test/factories/News'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NewsPage } from './NewsPage'

import type { News } from 'oa-shared'

const Theme = testingThemeStyles

const activeUser = FactoryUser({
  roles: [UserRole.BETA_TESTER],
})

const mockNewsItem = FactoryNewsItem({
  slug: 'testSlug',
})

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({
    profile: FactoryUser(),
  }),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

describe('News', () => {
  afterEach(() => {
    // Clear all mocks after each test to ensure there's no leakage between tests
    vi.clearAllMocks()
  })

  describe('Breadcrumbs', () => {
    it('displays breadcrumbs without category', async () => {
      // Arrange
      mockNewsItem.title = 'Do you prefer camping near a lake or in a forest?'
      mockNewsItem.category = null

      // Act
      let wrapper
      act(() => {
        wrapper = getWrapper(mockNewsItem)
      })

      // Assert: Check the breadcrumb items and chevrons
      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(2)
        expect(breadcrumbItems[0]).toHaveTextContent('News')
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

const getWrapper = (news: News) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/news/:slug" key={1} element={<NewsPage news={news} />} />,
    ),
    {
      initialEntries: ['/news/news'],
    },
  )

  return render(
    <Provider
      profileStore={{
        user: activeUser,
      }}
    >
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
