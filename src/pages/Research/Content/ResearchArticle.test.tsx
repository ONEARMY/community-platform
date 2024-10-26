import '@testing-library/jest-dom/vitest'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import { createRoutesFromElements, Route } from '@remix-run/react'
import { act, render, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { formatDistanceToNow } from 'date-fns'
import { Provider } from 'mobx-react'
import { ResearchUpdateStatus, UserRole } from 'oa-shared'
import { useResearchStore } from 'src/stores/Research/research.store'
import { FactoryDiscussion } from 'src/test/factories/Discussion'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { describe, expect, it, vi } from 'vitest'

import ResearchArticle from './ResearchArticle'

import type { IResearchDB } from 'oa-shared'
import type { Mock } from 'vitest'

const Theme = testingThemeStyles

const activeUser = FactoryUser({
  userRoles: [UserRole.BETA_TESTER],
})

const mockUser = FactoryUser({ country: 'AF' })
const mockDiscussionItem = FactoryDiscussion()

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserByUsername: vi.fn().mockResolvedValue(mockUser),
      },
      aggregationsStore: {
        isVerified: vi.fn(),
        users_verified: {},
      },
      tagsStore: {},
      discussionStore: {
        fetchOrCreateDiscussionBySource: vi.fn().mockResolvedValue({
          mockDiscussionItem,
        }),
        activeUser: mockUser,
      },
    },
  }),
}))

vi.mock('src/stores/Research/research.store')

describe('Research Article', () => {
  const mockResearchStore = {
    addSubscriberToResearchArticle: vi.fn(),
    formatResearchCommentList: vi.fn(),
    incrementViewCount: vi.fn(),
  }

  it('displays content statistics', async () => {
    // Arrange
    const activeResearchItem = FactoryResearchItem({
      collaborators: undefined,
      updates: [
        FactoryResearchItemUpdate({
          status: ResearchUpdateStatus.PUBLISHED,
          _deleted: false,
        }),
      ],
    })

    ;(useResearchStore as Mock).mockReturnValue(mockResearchStore)

    // Act
    let wrapper
    act(() => {
      wrapper = getWrapper(activeResearchItem)
    })

    // Assert
    await waitFor(() => {
      expect(
        wrapper.getByText(`${activeResearchItem.total_views} views`),
      ).toBeInTheDocument()
      expect(wrapper.getByText('0 following')).toBeInTheDocument()
      expect(wrapper.getByText('0 useful')).toBeInTheDocument()
      expect(wrapper.getByText('0 comments')).toBeInTheDocument()
      expect(wrapper.getByText('1 step')).toBeInTheDocument()
    })
  })

  it('does not display contributors when undefined', async () => {
    // Arrange
    ;(useResearchStore as Mock).mockReturnValue(mockResearchStore)

    // Act
    let wrapper
    await act(async () => {
      wrapper = getWrapper(
        FactoryResearchItem({
          collaborators: undefined,
        }),
      )
    })

    // Assert
    expect(() => {
      wrapper.getAllByTestId('ArticleCallToAction: contributors')
    }).toThrow()
  })

  it('displays contributors', async () => {
    // Arrange
    ;(useResearchStore as Mock).mockReturnValue(mockResearchStore)

    // Act
    let wrapper
    act(() => {
      wrapper = getWrapper(
        FactoryResearchItem({
          collaborators: ['example-username', 'another-example-username'],
        }),
      )
    })

    // Assert
    await waitFor(() => {
      expect(wrapper.getAllByText('With contributions from')).toHaveLength(1)
      expect(wrapper.getAllByText('example-username')).toHaveLength(2)
      expect(wrapper.getAllByText('another-example-username')).toHaveLength(2)
      expect(wrapper.getAllByTestId('Username: known flag')).toHaveLength(4)
    })
  })

  it('displays "Follow" button for non-subscriber', async () => {
    // Arrange
    ;(useResearchStore as Mock).mockReturnValue({
      ...mockResearchStore,
      activeUser,
    })

    // Act
    let wrapper
    act(() => {
      wrapper = getWrapper(
        FactoryResearchItem({
          userHasSubscribed: false,
        }),
      )
    })

    await waitFor(() => {
      const followButton = wrapper.getAllByTestId('follow-button')[0]

      // Assert
      expect(followButton).toBeInTheDocument()
      expect(followButton).toHaveTextContent('Follow')
      expect(followButton).not.toHaveTextContent('Following')
    })
  })

  it.todo('displays "Following" button for subscriber')

  // TODO: Work out how to simulate store subscribe functionality
  // it('displays "Following" button for subscriber',  () => {
  //   // Arrange
  //   ;(useResearchStore as Mock).mockReturnValue({
  //     ...mockResearchStore,
  //     activeResearchItem: FactoryResearchItem({
  //       subscribers: [activeUser._id],
  //       userHasSubscribed: true,
  //     }),
  //     activeUser,
  //   })

  //   // Act
  //   let wrapper
  //    act( () => {
  //     wrapper = getWrapper()
  //   })
  //   const followButton = wrapper.getAllByTestId('follow-button')[0]

  //   // Assert
  //   expect(followButton).toBeInTheDocument()
  // })

  describe('Research Update', () => {
    it('displays contributors', async () => {
      // Arrange
      ;(useResearchStore as Mock).mockReturnValue(mockResearchStore)

      // wait for Promise to resolve and state to update
      let wrapper
      act(() => {
        wrapper = getWrapper(
          FactoryResearchItem({
            collaborators: ['example-username', 'another-example-username'],
            updates: [
              FactoryResearchItemUpdate({
                title: 'Research Update #1',
                collaborators: [
                  'third-example-username',
                  'fourth-example-username',
                ],
                status: ResearchUpdateStatus.PUBLISHED,
                _deleted: false,
              }),
              FactoryResearchItemUpdate({
                title: 'Research Update #2',
                collaborators: null!,
                status: ResearchUpdateStatus.PUBLISHED,
                _deleted: false,
              }),
              FactoryResearchItemUpdate({
                title: 'Research Update #3',
                collaborators: undefined,
                status: ResearchUpdateStatus.PUBLISHED,
                _deleted: false,
              }),
            ],
          }),
        )
      })

      // Assert
      await waitFor(
        () => {
          expect(wrapper.getAllByText('With contributions from')).toHaveLength(
            1,
          )
          expect(wrapper.getAllByText('example-username')).toHaveLength(2)
          expect(wrapper.getAllByText('another-example-username')).toHaveLength(
            2,
          )
          expect(wrapper.getAllByText('third-example-username')).toHaveLength(1)
          expect(wrapper.queryByText('fourth-example-username')).toBeNull()
          expect(wrapper.getAllByTestId('collaborator/creator')).toHaveLength(1)
          expect(wrapper.getAllByTestId('Username: known flag')).toHaveLength(5)
        },
        {
          timeout: 10000,
        },
      )
    })

    it('does not show edit timestamp, when create displays the same value', async () => {
      const _created = faker.date.past().toString()
      const update = FactoryResearchItemUpdate({
        _created,
        _modified: _created,
        title: 'A title',
        description: 'A description',
      })
      ;(useResearchStore as Mock).mockReturnValue(mockResearchStore)
      // Act
      const item = FactoryResearchItem({
        _created,
        _modified: _created,
        _contentModifiedTimestamp: _created,
        updates: [update],
      })
      const wrapper = getWrapper(item)

      // Assert
      await waitFor(() => {
        const lastUpdate = wrapper.getByTestId('last-update')
        expect(lastUpdate).not.toBeVisible()

        expect(() =>
          wrapper.getAllByText((content) => content.includes('edited')),
        ).toThrow()
        expect(() =>
          wrapper.getAllByText((content) => content.includes('created')),
        ).not.toThrow()
      })
    })

    it('does show both created and edit timestamp, when different', async () => {
      const modified = faker.date.past({ years: 1 })
      const created = faker.date.past({ years: 2 })
      const update = FactoryResearchItemUpdate({
        _created: created.toString(),
        status: ResearchUpdateStatus.PUBLISHED,
        _modified: modified.toString(),
        title: 'A title',
        description: 'A description',
        _deleted: false,
      })
      ;(useResearchStore as Mock).mockReturnValue({
        ...mockResearchStore,
        formatResearchCommentList: vi.fn().mockImplementation((c) => {
          return c
        }),
      })

      // Act
      const wrapper = getWrapper(
        FactoryResearchItem({
          updates: [update],
        }),
      )
      // Assert
      await waitFor(() => {
        expect(() =>
          wrapper.getAllByText((content) => content.includes('created')),
        ).not.toThrow()
        expect(() =>
          wrapper.getAllByText(
            `${formatDistanceToNow(created, { addSuffix: true })}`,
          ),
        ).not.toThrow()
        expect(() =>
          wrapper.getAllByText((content) => content.includes('edited')),
        ).not.toThrow()
        expect(() =>
          wrapper.getAllByText(
            `${formatDistanceToNow(modified, { addSuffix: true })}`,
          ),
        ).not.toThrow()
      })
    })
  })

  it('shows only published updates', async () => {
    // Arrange
    ;(useResearchStore as Mock).mockReturnValue(mockResearchStore)

    // Act
    let wrapper
    act(() => {
      wrapper = getWrapper(
        FactoryResearchItem({
          collaborators: ['example-username', 'another-example-username'],
          updates: [
            FactoryResearchItemUpdate({
              title: 'Research Update #1',
              status: ResearchUpdateStatus.PUBLISHED,
              _deleted: false,
            }),
            FactoryResearchItemUpdate({
              title: 'Research Update #2',
              status: ResearchUpdateStatus.DRAFT,
              _deleted: false,
            }),
          ],
        }),
      )
    })

    // Assert
    await waitFor(() => {
      expect(wrapper.getByText('Research Update #1')).toBeInTheDocument()
      expect(wrapper.queryByText('Research Update #2')).not.toBeInTheDocument()
    })
  })

  describe('Breadcrumbs', () => {
    it('displays breadcrumbs with category', async () => {
      // Arrange
      ;(useResearchStore as Mock).mockReturnValue(mockResearchStore)

      // Act
      let wrapper
      act(() => {
        wrapper = getWrapper(
          FactoryResearchItem({
            title: 'Innovative Study',
            researchCategory: {
              label: 'Science',
              _id: faker.string.uuid(),
              _modified: faker.date.past().toString(),
              _created: faker.date.past().toString(),
              _deleted: faker.datatype.boolean(),
              _contentModifiedTimestamp: faker.date.past().toString(),
            },
          }),
        )
      })

      // Assert: Check the breadcrumb items and chevrons
      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(3)
        expect(breadcrumbItems[0]).toHaveTextContent('Research')
        expect(breadcrumbItems[1]).toHaveTextContent('Science')
        expect(breadcrumbItems[2]).toHaveTextContent('Innovative Study')

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
      ;(useResearchStore as Mock).mockReturnValue(mockResearchStore)

      // Act
      let wrapper
      act(() => {
        wrapper = getWrapper(
          FactoryResearchItem({
            title: 'Innovative Study',
            researchCategory: undefined, // No category provided
          }),
        )
      })

      // Assert: Check the breadcrumb items and chevrons
      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(2)
        expect(breadcrumbItems[0]).toHaveTextContent('Research')
        expect(breadcrumbItems[1]).toHaveTextContent('Innovative Study')

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

const getWrapper = (research: IResearchDB) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route
        path="/research/:slug"
        key={1}
        element={<ResearchArticle research={research} />}
      />,
    ),
    {
      initialEntries: ['/research/article'],
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
