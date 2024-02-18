jest.mock('../../stores/common/module.store')

import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

import Unsubscribe from './Unsubscribe'

const Theme = testingThemeStyles

const mockUnsubscribeUser = jest.fn()

// Similar to issues in Academy.test.tsx - stub methods called in user store constructor
// TODO - replace with mock store or avoid direct call
jest.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        user: {},
        unsubscribeUser: mockUnsubscribeUser,
      },
      aggregationsStore: {
        aggregations: {
          users_totalUseful: {
            HowtoAuthor: 0,
          },
          users_verified: {
            HowtoAuthor: true,
          },
        },
      },
      howtoStore: {},
    },
  }),
}))

describe('Unsubscribe', () => {
  it('displays meaningful message to user', async () => {
    const wrapper = renderFn('def')
    expect(wrapper.getByText('Unsubscribe')).toBeInTheDocument()

    await waitFor(() => {
      expect(mockUnsubscribeUser).toHaveBeenCalledWith('def')
      expect(
        wrapper.getByText((t) => t.includes('You have been unsubscibed')),
      ).toBeInTheDocument()
    })
  })

  it('handles error unsubscribing', async () => {
    mockUnsubscribeUser.mockRejectedValueOnce(new Error('test error'))
    const wrapper = renderFn()
    expect(wrapper.getByText('Unsubscribe')).toBeInTheDocument()
    await waitFor(() => {
      expect(
        wrapper.getByText((t) => t.includes('Oops, something went wrong')),
      ).toBeInTheDocument()
    })
  })

  // Add more test cases as needed
})

const renderFn = (unsubscribeToken = 'abc') => {
  return render(
    <Provider>
      <ThemeProvider theme={Theme}>
        <RouterProvider
          router={createMemoryRouter(
            createRoutesFromElements(
              <Route path="/unsubscribe/*" element={<Unsubscribe />} />,
            ),
            {
              initialEntries: [`/unsubscribe/${unsubscribeToken}`],
            },
          )}
        />
      </ThemeProvider>
    </Provider>,
  )
}
