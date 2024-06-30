import '@testing-library/jest-dom/vitest'

import { ThemeProvider } from '@emotion/react'
import { act, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { describe, expect, it, vi } from 'vitest'

import { FactoryUser } from '../test/factories/User'
import { testingThemeStyles } from '../test/utils/themeUtils'
import { DiscussionWrapper } from './DiscussionWrapper'

import type { IDiscussion } from '../models'

const Theme = testingThemeStyles
const mockUser = FactoryUser()

vi.mock('../common/hooks/useCommonStores', () => ({
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
  it('loads the component', async () => {
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

    await waitFor(() => {
      expect(wrapper.getByText('Start the discussion')).toBeVisible()
    })
  })
})
