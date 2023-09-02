import { Provider } from 'mobx-react'
import { Form } from 'react-final-form'
import { useCommonStores } from 'src'
import arrayMutators from 'final-form-arrays'

import { FactoryHowto } from 'src/test/factories/Howto'

jest.mock('src/index', () => {
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
          categoryTags: [
            {
              categories: ['how-to'],
              label: 'test tag 1',
              image: 'test img',
            },
          ],
          setTagsCategory: jest.fn(),
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
