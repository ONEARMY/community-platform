import { act } from 'react-dom/test-utils'
import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { fireEvent, render } from '@testing-library/react'
import { FactoryResearchItemUpdate } from 'src/test/factories/ResearchItem'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

import { ResearchUpdateForm } from './ResearchUpdate.form'

const Theme = testingThemeStyles

jest.mock('src/stores/Research/research.store', () => {
  return {
    useResearchStore: () => ({
      updateUploadStatus: {
        Start: false,
        Images: false,
        Files: false,
        Database: false,
        Complete: false,
      },
      isTitleThatReusesSlug: jest.fn(),
      unlockResearchUpdate: jest.fn(),
    }),
  }
})

describe('Research update form', () => {
  describe('Invalid file warning', () => {
    it('Does not appear when submitting only fileLink', async () => {
      const formValues = FactoryResearchItemUpdate({
        fileLink: 'www.filedonwload.test',
      })

      let wrapper
      await act(async () => {
        wrapper = await getWrapper(formValues, 'create', {})
      })

      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })

    it('Does not appear when submitting only files', async () => {
      // Arrange
      const formValues = FactoryResearchItemUpdate({
        files: [new File(['test file content'], 'test-file.zip')],
      })

      // Act
      let wrapper
      await act(async () => {
        wrapper = await getWrapper(formValues, 'create', {})
      })

      // Assert
      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })

    it('Appears when submitting 2 file types', async () => {
      // Arrange
      const formValues = FactoryResearchItemUpdate({
        images: [new File(['hello'], 'hello.png')],
        files: [new File(['test file content'], 'test-file.zip')],
        fileLink: 'www.filedownload.test',
      })

      // Act
      let wrapper
      await act(async () => {
        wrapper = await getWrapper(formValues, 'create', {})
        // submit form
        const submitFormButton = wrapper.getByTestId('submit-form')
        fireEvent.click(submitFormButton)
      })

      // Assert
      expect(wrapper.queryByTestId('invalid-file-warning')).toBeInTheDocument()
    })
  })
})

const getWrapper = async (formValues, parentType, navProps) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route
        path="/research/:slug/update"
        element={
          <ResearchUpdateForm
            formValues={formValues}
            parentType={parentType}
            {...navProps}
          />
        }
      />,
    ),
    { initialEntries: ['/research/:slug/update'] },
  )
  return render(
    <ThemeProvider theme={Theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  )
}
