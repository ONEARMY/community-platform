import '@testing-library/jest-dom/vitest'

import { Global } from '@emotion/react'
import { faker } from '@faker-js/faker'
import { createRemixStub } from '@remix-run/testing'
import { act, render, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { GlobalStyles } from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { preciousPlasticTheme } from 'oa-themes'
import {
  FactoryLibraryItem,
  FactoryLibraryItemStep,
} from 'src/test/factories/Library'
import { describe, expect, it, vi } from 'vitest'

import { Library } from './ProjectPage'

import type { Project } from 'oa-shared'

const Theme = preciousPlasticTheme.styles
const item = FactoryLibraryItem()

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {},
    },
  }),
}))

const factory = (override?: Project) => {
  const ReactStub = createRemixStub([
    {
      index: true,
      Component: () => (
        <>
          <Global styles={GlobalStyles} />
          <ThemeProvider theme={Theme}>
            <Provider>
              <Library item={override ?? item} />
            </Provider>
          </ThemeProvider>
        </>
      ),
    },
  ])

  return render(<ReactStub />)
}
describe('Library', () => {
  describe('moderator feedback', () => {
    it('displays feedback for items which are not accepted', async () => {
      let wrapper
      item.moderation = IModerationStatus.AWAITING_MODERATION
      item.moderatorFeedback = 'Moderation comments'

      act(() => {
        wrapper = factory()
      })

      await waitFor(() => {
        expect(wrapper.getByText('Moderation comments')).toBeInTheDocument()
      })
    })

    it('hides feedback when project is accepted', async () => {
      let wrapper
      item.moderation = IModerationStatus.ACCEPTED
      item.moderatorFeedback = 'Moderation comments'

      await act(async () => {
        wrapper = factory()
      })

      expect(() => wrapper.getByText('Moderation comments')).toThrow()
    })
  })

  it('displays content statistics', async () => {
    let wrapper
    item.id = 1
    item.author = {
      id: faker.number.int(),
      displayName: 'LibraryAuthor',
      isVerified: true,
      isSupporter: false,
      photoUrl: faker.image.avatar(),
      username: faker.internet.userName(),
    }
    item.steps = [FactoryLibraryItemStep({})]
    item.moderation = IModerationStatus.ACCEPTED
    item.totalViews = 0

    act(() => {
      wrapper = factory()
    })

    await waitFor(() => {
      expect(wrapper.getByText('0 views')).toBeInTheDocument()
      expect(wrapper.getByText('0 useful')).toBeInTheDocument()
      expect(wrapper.getByText('0 comments')).toBeInTheDocument()
      expect(wrapper.getByText('1 step')).toBeInTheDocument()
    })
  })

  it('shows verified badge', async () => {
    let wrapper

    item.author = {
      id: faker.number.int(),
      displayName: 'LibraryAuthor',
      isVerified: true,
      isSupporter: false,
      photoUrl: faker.image.avatar(),
      username: faker.internet.userName(),
    }

    act(() => {
      wrapper = factory()
    })

    await waitFor(() => {
      expect(() => wrapper.getAllByTestId('Username: verified badge'))
    })
  })

  it('does not show verified badge', async () => {
    let wrapper
    item.author = {
      id: faker.number.int(),
      displayName: 'NotLibraryAuthor',
      isVerified: false,
      isSupporter: false,
      photoUrl: faker.image.avatar(),
      username: faker.internet.userName(),
    }
    await act(async () => {
      wrapper = factory()
    })

    expect(() => {
      wrapper.getAllByTestId('Username: verified badge')
    }).toThrow()
  })

  describe('steps', () => {
    it('shows 1 step', async () => {
      let wrapper
      act(() => {
        wrapper = factory(
          FactoryLibraryItem({
            author: {
              id: faker.number.int(),
              displayName: 'LibraryAuthor',
              isVerified: true,
              isSupporter: false,
              photoUrl: faker.image.avatar(),
              username: faker.internet.userName(),
            },
            steps: [FactoryLibraryItemStep()],
          }),
        )
      })

      await waitFor(() => {
        expect(() => wrapper.getAllByText('1 step'))
      })
    })

    it('shows 2 steps', async () => {
      let wrapper
      act(() => {
        item.steps = [FactoryLibraryItemStep(), FactoryLibraryItemStep()]
        wrapper = factory()
      })

      await waitFor(() => {
        expect(() => wrapper.getAllByText('2 steps'))
      })
    })
  })

  describe('Breadcrumbs', () => {
    it('displays breadcrumbs with category', async () => {
      let wrapper
      act(() => {
        item.title = 'DIY Recycling Machine'
        item.category = {
          name: 'DIY',
          id: faker.number.int(),
          modifiedAt: faker.date.past(),
          createdAt: faker.date.past(),
          type: 'projects',
        }
        wrapper = factory()
      })

      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(3)
        expect(breadcrumbItems[0]).toHaveTextContent('Library')
        expect(breadcrumbItems[1]).toHaveTextContent('DIY')
        expect(breadcrumbItems[2]).toHaveTextContent('DIY Recycling Machine')

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
      let wrapper
      act(() => {
        item.title = 'DIY Recycling Machine'
        item.category = null
        wrapper = factory()
      })

      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(2)
        expect(breadcrumbItems[0]).toHaveTextContent('Library')
        expect(breadcrumbItems[1]).toHaveTextContent('DIY Recycling Machine')

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
