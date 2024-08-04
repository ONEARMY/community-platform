import '@testing-library/jest-dom/vitest'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { faker } from '@faker-js/faker'
import { createRoutesFromElements, Route } from '@remix-run/react'
import { act, render, waitFor, within } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { preciousPlasticTheme } from 'oa-themes'
import { FactoryHowto, FactoryHowtoStep } from 'src/test/factories/Howto'
import { describe, expect, it, vi } from 'vitest'

import type { HowtoStore } from 'src/stores/Howto/howto.store'

const Theme = preciousPlasticTheme.styles

const howto = FactoryHowto()

const mockHowtoStore = () => ({
  setActiveHowtoBySlug: vi.fn(),
  activeHowto: howto,
  needsModeration: vi.fn().mockReturnValue(false),
  incrementViewCount: vi.fn(),
  removeActiveHowto: vi.fn(),
})

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {},
      aggregationsStore: {
        isVerified: vi.fn((userId) => userId === 'HowtoAuthor'),
        users_verified: {
          HowtoAuthor: true,
        },
      },
      howtoStore: mockHowtoStore(),
      tagsStore: {},
    },
  }),
}))

import { IModerationStatus } from 'oa-shared'

import { Howto } from './Howto'

const factory = (howtoStore?: Partial<HowtoStore>) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/howto/:slug" key={1} element={<Howto />} />,
    ),
    { initialEntries: ['/howto/article'] },
  )

  return render(
    <Provider howtoStore={howtoStore}>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
describe('Howto', () => {
  describe('moderator feedback', () => {
    it('displays feedback for items which are not accepted', async () => {
      let wrapper

      act(() => {
        howto.moderation = IModerationStatus.AWAITING_MODERATION
        howto.moderatorFeedback = 'Moderation comments'

        wrapper = factory()
      })

      await waitFor(() => {
        expect(wrapper.getByText('Moderation comments')).toBeInTheDocument()
      })
    })

    it('hides feedback when how-to is accepted', async () => {
      let wrapper
      howto.moderation = IModerationStatus.ACCEPTED
      howto.moderatorFeedback = 'Moderation comments'

      await act(async () => {
        wrapper = factory()
      })

      expect(() => wrapper.getByText('Moderation comments')).toThrow()
    })
  })

  it('displays content statistics', async () => {
    let wrapper
    act(() => {
      howto._id = 'testid'
      howto._createdBy = 'HowtoAuthor'
      howto.steps = [FactoryHowtoStep({})]
      howto.moderation = IModerationStatus.ACCEPTED
      howto.total_views = 0

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

    howto._createdBy = 'HowtoAuthor'

    act(() => {
      wrapper = factory()
    })

    await waitFor(() => {
      expect(() => wrapper.getAllByTestId('Username: verified badge'))
    })
  })

  it('does not show verified badge', async () => {
    let wrapper
    howto._createdBy = 'NotHowtoAuthor'

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
        wrapper = factory({
          ...mockHowtoStore(),
          activeHowto: FactoryHowto({
            _createdBy: 'HowtoAuthor',
            steps: [FactoryHowtoStep()],
          }),
        })
      })

      await waitFor(() => {
        expect(() => wrapper.getAllByText('1 step'))
      })
    })

    it('shows 2 steps', async () => {
      let wrapper
      act(() => {
        howto.steps = [FactoryHowtoStep(), FactoryHowtoStep()]
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
        howto.title = 'DIY Recycling Machine'
        howto.category = {
          label: 'DIY',
          _id: faker.string.uuid(),
          _modified: faker.date.past().toString(),
          _created: faker.date.past().toString(),
          _deleted: faker.datatype.boolean(),
          _contentModifiedTimestamp: faker.date.past().toString(),
        }
        wrapper = factory()
      })

      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(3)
        expect(breadcrumbItems[0]).toHaveTextContent('How To')
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
        howto.title = 'DIY Recycling Machine'
        howto.category = undefined
        wrapper = factory()
      })

      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
        expect(breadcrumbItems).toHaveLength(2)
        expect(breadcrumbItems[0]).toHaveTextContent('How To')
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
