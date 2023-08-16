import { Provider } from 'mobx-react'
import { Form } from 'react-final-form'
import { useCommonStores } from 'src'
import arrayMutators from 'final-form-arrays'

import { FactoryResearchItem } from 'src/test/factories/ResearchItem'

jest.mock('src/index', () => {
  return {
    useCommonStores: () => ({
      stores: {
        categoriesStore: {
          allCategories: [],
        },
        researchStore: {
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

export const ResearchProvider = ({ children }) => {
  const formProps = {
    formValues: FactoryResearchItem(),
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
