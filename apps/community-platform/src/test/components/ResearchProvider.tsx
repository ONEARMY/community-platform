import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryResearchItem } from 'src/test/factories/ResearchItem'
import { vi } from 'vitest'

vi.mock('src/common/hooks/useCommonStores', () => {
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
