import '@testing-library/jest-dom/vitest'

import { act, render, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { FactoryUser } from 'src/test/factories/User'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { describe, expect, it, vi } from 'vitest'

import { DiscussionWrapper } from './DiscussionWrapper'

import type { IDiscussion } from 'oa-shared'

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

vi.mock('oa-components', () => ({
  __esModule: true,
  DiscussionContainer: () => <>Start the discussion</>,
  Loader: () => <></>,
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
