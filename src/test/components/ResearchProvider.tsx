import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/index'
import { TagCategory } from 'src/models'
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
