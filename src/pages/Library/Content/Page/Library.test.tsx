import '@testing-library/jest-dom/vitest'

import { Global } from '@emotion/react'
import { faker } from '@faker-js/faker'
import { createRemixStub } from '@remix-run/testing'
import { act, render, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { GlobalStyles } from 'oa-components'
import { preciousPlasticTheme } from 'oa-themes'
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store'
import {
  FactoryLibraryItem,
  FactoryLibraryItemStep,
} from 'src/test/factories/Library'
import { describe, expect, it } from 'vitest'

import { ProjectPage } from './ProjectPage'

import type { Project } from 'oa-shared'

const Theme = preciousPlasticTheme.styles
const item = FactoryLibraryItem()

const factory = (override?: Project) => {
  const ReactStub = createRemixStub([
    {
      index: true,
      Component: () => (
        <>
          <Global styles={GlobalStyles} />
          <ProfileStoreProvider>
            <ThemeProvider theme={Theme}>
              <Provider>
                <ProjectPage item={override ?? item} />
              </Provider>
            </ThemeProvider>
          </ProfileStoreProvider>
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
      item.author = {
        id: faker.number.int(),
        displayName: 'LibraryAuthor',
        isVerified: true,
        isSupporter: false,
        photo: {
          publicUrl: faker.image.avatar(),
          id: '',
        },
        username: faker.internet.userName(),
      }
      item.moderation = 'awaiting-moderation'
      item.moderationFeedback = 'Moderation comments'

      act(() => {
        wrapper = factory()
      })

      await waitFor(() => {
        expect(wrapper.getByText('Moderation comments')).toBeInTheDocument()
      })
    })

    it('hides feedback when project is accepted', async () => {
      let wrapper
      item.moderation = 'accepted'
      item.moderationFeedback = 'Moderation comments'

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
      photo: {
        publicUrl: faker.image.avatar(),
        id: '',
      },
      username: faker.internet.userName(),
    }
    item.steps = [FactoryLibraryItemStep({})]
    item.moderation = 'accepted'
    item.totalViews = 0
    item.usefulCount = 0
    item.commentCount = 0

    act(() => {
      wrapper = factory()
    })

    expect(wrapper.getByText('0 views')).toBeInTheDocument()
    expect(wrapper.getByText('0 useful')).toBeInTheDocument()
    expect(wrapper.getByText('0 comments')).toBeInTheDocument()
    expect(wrapper.getByText('1 step')).toBeInTheDocument()
  })

  it('shows verified badge', async () => {
    let wrapper

    item.author = {
      id: faker.number.int(),
      displayName: 'LibraryAuthor',
      isVerified: true,
      isSupporter: false,
      photo: {
        publicUrl: faker.image.avatar(),
        id: '',
      },
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
      photo: {
        publicUrl: faker.image.avatar(),
        id: '',
      },
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
              photo: {
                publicUrl: faker.image.avatar(),
                id: '',
              },
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
          name: 'Machines',
          id: faker.number.int(),
          modifiedAt: faker.date.past(),
          createdAt: faker.date.past(),
          type: 'projects',
        }
        wrapper = factory(item)
      })

      const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem')
      expect(breadcrumbItems).toHaveLength(3)
      expect(breadcrumbItems[0]).toHaveTextContent('Library')
      expect(breadcrumbItems[1]).toHaveTextContent('Machines')
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
})
