import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryHowto } from 'src/test/factories/Howto'

jest.mock('src/common/hooks/useCommonStores', () => {
  return {
    useCommonStores: () => ({
      stores: {
        categoriesStore: {
          allCategories: [],
        },
        howtoStore: {
          uploadStatus: {
            Start: false,
            Cover: false,
            'Step Images': false,
            Files: false,
            Database: false,
            Complete: false,
          },
          validateTitleForSlug: jest.fn(),
          uploadHowTo: jest.fn(),
        },
        tagsStore: {
          allTags: [
            {
              label: 'test tag 1',
              image: 'test img',
            },
          ],
        },
      },
    }),
  }
})

export const HowtoProvider = ({ children }) => {
  const formProps = {
    formValues: FactoryHowto(),
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
