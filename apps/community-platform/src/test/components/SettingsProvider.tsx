import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { Provider } from 'mobx-react'
import { vi } from 'vitest'

import { useCommonStores } from '../../common/hooks/useCommonStores'
import { FactoryUser } from '../../test/factories/User'

const mockGetUserProfile = vi.fn().mockResolvedValue(FactoryUser)
const mockUpdateUserBadge = vi.fn()

vi.mock('../../common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: mockGetUserProfile,
        updateUserBadge: mockUpdateUserBadge,
      },
      aggregationsStore: {
        users_verified: {
          HowtoAuthor: true,
        },
      },
      themeStore: {
        currentTheme: {
          styles: {
            communityProgramURL: '',
          },
        },
      },
      mapsStore: {},
      tagsStore: {},
    },
  }),
}))

export const SettingsProvider = ({ children }) => {
  const user = FactoryUser()

  const formProps = {
    formValues: user,
    onSubmit: vi.fn(),
    mutators: { ...arrayMutators },
    component: () => children,
  }

  return (
    <Provider {...useCommonStores().stores}>
      <Form {...formProps} />
    </Provider>
  )
}
