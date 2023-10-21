import { Provider } from 'mobx-react'
import { Form } from 'react-final-form'
import { useCommonStores } from 'src/index'
import arrayMutators from 'final-form-arrays'

import { FactoryResearchItem } from 'src/test/factories/ResearchItem'

vi.mock('src/index', () => {
  return {
    useCommonStores: () => ({
      stores: {
        categoriesStore: {
          allCategories: [],
        },
        researchStore: {
          validateTitleForSlug: vi.fn(),
          uploadHowTo: vi.fn(),
        },
        tagsStore: {
          categoryTags: [
            {
              categories: ['how-to'],
              label: 'test tag 1',
              image: 'test img',
            },
          ],
          setTagsCategory: vi.fn(),
        },
      },
    }),
  }
})

export const ResearchProvider = ({ children }) => {
  const formProps = {
    formValues: FactoryResearchItem(),
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
