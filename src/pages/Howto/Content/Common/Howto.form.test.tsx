import '@testing-library/jest-dom/vitest'

import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryHowto } from 'src/test/factories/Howto'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { describe, expect, it, vi } from 'vitest'

import { HowtoForm } from './Howto.form'

import type { IHowtoDB } from 'src/models'
import type { ParentType } from './Howto.form'

const Theme = testingThemeStyles

vi.mock('src/common/hooks/useCommonStores', () => {
  return {
    useCommonStores: () => ({
      stores: {
        howtoStore: {
          uploadStatus: {
            Start: false,
            Cover: false,
            'Step Images': false,
            Files: false,
            Database: false,
            Complete: false,
          },
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

describe('Howto form', () => {
  describe('Provides user information', () => {
    it('shows maximum file size', () => {
      // Arrange
      const formValues = FactoryHowto()
      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(formValues, 'edit', {})
      })

      // Assert
      expect(wrapper.getByText('Maximum file size 50MB')).toBeInTheDocument()
    })
  })

  describe('Invalid file warning', () => {
    it('Does not appear when submitting only fileLink', () => {
      // Arrange
      const formValues = FactoryHowto({ fileLink: 'www.test.com' })
      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(formValues, 'edit', {})
      })

      // Assert
      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })

    it('Does not appear when submitting only files', () => {
      // Arrange
      const formValues = FactoryHowto({
        files: [
          new File(['test file content'], 'test-file.pdf', {
            type: 'application/pdf',
          }),
        ],
      })

      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(formValues, 'edit', {})
      })

      // Assert
      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })

    it('Appears when submitting 2 file types', () => {
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
      let wrapper
      act(() => {
        wrapper = Wrapper(formValues, 'edit', {})
      })

      // Assert
      expect(wrapper.queryByTestId('invalid-file-warning')).toBeInTheDocument()
    })

    it('Does not appear when files are removed and filelink added', async () => {
      // Arrange
      const formValues = FactoryHowto({
        files: [
          new File(['test file content'], 'test-file.pdf', {
            type: 'application/pdf',
          }),
        ],
      })

      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(formValues, 'edit', {})
      })

      await waitFor(() => {
        // clear files
        const reuploadFilesButton = wrapper.getByTestId('re-upload-files')
        fireEvent.click(reuploadFilesButton)

        // add fileLink
        const fileLink = wrapper.getByPlaceholderText(
          'Link to Google Drive, Dropbox, Grabcad etc',
        )
        fireEvent.change(fileLink, {
          target: { value: '<http://www.test.com>' },
        })

        // submit form
        fireEvent.click(wrapper.getByTestId('submit-form'))
      })

      // Assert
      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })
  })
})

const Wrapper = (formValues: IHowtoDB, parentType: ParentType, navProps) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route
        index
        element={
          <HowtoForm
            formValues={formValues}
            parentType={parentType}
            {...navProps}
          />
        }
      />,
    ),
  )

  return render(
    <Provider {...useCommonStores().stores}>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
