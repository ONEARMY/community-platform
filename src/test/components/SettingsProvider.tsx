import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/index'
import { FactoryUser } from 'src/test/factories/User'

const mockGetUserProfile = jest.fn().mockResolvedValue(FactoryUser)
const mockUpdateUserBadge = jest.fn()

jest.mock('src/index', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        getUserProfile: mockGetUserProfile,
        updateUserBadge: mockUpdateUserBadge,
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
