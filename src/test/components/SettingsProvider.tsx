import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryUser } from 'src/test/factories/User'

const mockGetUserProfile = jest.fn().mockResolvedValue(FactoryUser)
const mockUpdateUserBadge = jest.fn()

jest.mock('src/common/hooks/useCommonStores', () => ({
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
    onSubmit: jest.fn(),
    mutators: { ...arrayMutators },
    component: () => children,
  }

  return (
    <Provider {...useCommonStores().stores}>
      <Form {...formProps} />
    </Provider>
  )
}
