import { render } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { HowtoForm } from './Howto.form'
import { MemoryRouter } from 'react-router'
import { ThemeProvider } from 'theme-ui'
import { preciousPlasticTheme } from 'oa-themes'
import { useCommonStores } from 'src'
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

describe('Howto form', () => {
  it('Invalid file warning does not appear when submitting only fileLink', async () => {
    // Arrange
    const formValues = FactoryHowto({ fileLink: 'www.test.com' })

    // Act
    const wrapper = getWrapper(formValues, 'edit', {})

    // Assert
    expect(
      wrapper.queryByTestId('invalid-file-warning'),
    ).not.toBeInTheDocument()
  })

  it('Invalid file warning does not appear when submitting only files', async () => {
    // Arrange
    const formValues = FactoryHowto({
      files: [
        new File(['test file content'], 'test-file.pdf', {
          type: 'application/pdf',
        }),
      ],
    })

    // Act
    const wrapper = getWrapper(formValues, 'edit', {})

    // Assert
    expect(
      wrapper.queryByTestId('invalid-file-warning'),
    ).not.toBeInTheDocument()
  })

  it('Invalid file warning appears when submitting 2 file types', async () => {
    // Arrange
    const formValues = FactoryHowto({
      files: [
        new File(['test file content'], 'test-file.pdf', {
          type: 'application/pdf',
        }),
      ],
      fileLink: 'www.test.com',
    })

    // Act
    const wrapper = getWrapper(formValues, 'edit', {})

    // Assert
    expect(wrapper.queryByTestId('invalid-file-warning')).toBeInTheDocument()
  })
})

const getWrapper = (formValues, parentType, navProps) => {
  return render(
    <Provider {...useCommonStores().stores}>
      <ThemeProvider theme={preciousPlasticTheme.styles}>
        <MemoryRouter>
          <HowtoForm
            formValues={formValues}
            parentType={parentType}
            {...navProps}
          />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}
