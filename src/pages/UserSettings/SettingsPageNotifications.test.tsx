import '@testing-library/jest-dom/vitest'

import { act, waitFor } from '@testing-library/react'
import { EmailNotificationFrequency } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { FormProvider } from './__mocks__/FormProvider'
import { FirebaseNotifications } from './FirebaseNotifications'

let mockUser = FactoryUser({})

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        activeUser: mockUser,
      },
    },
  }),
}))

describe('FirebaseNotifications', () => {
  it('renders the users existing notification preference', async () => {
    mockUser = FactoryUser({
      notification_settings: {
        emailFrequency: EmailNotificationFrequency.MONTHLY,
      },
    })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <FirebaseNotifications />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByText('Monthly')).toHaveLength(1)
      expect(wrapper.queryByText('Weekly')).toBeNull()
    })
  })

  it('renders the option as never when a unsubscribe token is present', async () => {
    mockUser = FactoryUser({
      notification_settings: {
        emailFrequency: EmailNotificationFrequency.MONTHLY,
      },
      unsubscribeToken: 'something',
    })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <FirebaseNotifications />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByText('Never', { exact: false })).toHaveLength(1)
      expect(wrapper.queryByText('Weekly')).toBeNull()
    })
  })
})
