import '@testing-library/jest-dom/vitest'

import { ThemeProvider } from '@emotion/react'
import { act, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { describe, expect, it, vi } from 'vitest'

import { DiscussionWrapper } from './DiscussionWrapper'

import type { IDiscussion } from 'src/models'

const Theme = testingThemeStyles
const mockUser = FactoryUser()

vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      discussionStore: {
        fetchOrCreateDiscussionBySource: () => vi.fn(),
        activeUser: () => mockUser,
      },
    },
  }),
}))

// Happy path well tested in cypress
describe('DiscussionWrapper', () => {
  it('initally renders a loading before moving on', async () => {
    const discussionProps = {
      sourceType: 'question' as IDiscussion['sourceType'],
      sourceId: '82364tdf',
      setTotalCommentsCount: () => vi.fn(),
    }
    let wrapper

    act(() => {
      wrapper = render(
        <Provider>
          <ThemeProvider theme={Theme}>
            <DiscussionWrapper {...discussionProps} />
          </ThemeProvider>
        </Provider>,
      )
    })
    expect(wrapper.getByTestId('loader')).toBeVisible()

    await waitFor(async () => {
      expect(wrapper.getByText('Start the discussion')).toBeVisible()
    })
  })
})
