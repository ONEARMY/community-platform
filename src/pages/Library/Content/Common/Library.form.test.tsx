import '@testing-library/jest-dom/vitest'

import { createRemixStub } from '@remix-run/testing'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryLibraryItem } from 'src/test/factories/Library'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { describe, expect, it, vi } from 'vitest'

import { LibraryForm } from './Library.form'

import type { ILibrary } from 'oa-shared'
import type { ParentType } from './Library.form'

const Theme = testingThemeStyles

vi.mock('src/common/hooks/useCommonStores', () => {
  return {
    useCommonStores: () => ({
      stores: {
        LibraryStore: {
          uploadStatus: {
            Start: false,
            Cover: false,
            'Step Images': false,
            Files: false,
            Database: false,
            Complete: false,
          },
          validateTitleForSlug: vi.fn(),
          upload: vi.fn(),
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
      const formValues = FactoryLibraryItem()
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
      const formValues = FactoryLibraryItem({ fileLink: 'www.test.com' })
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
      const formValues = FactoryLibraryItem({
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
      const formValues = FactoryLibraryItem({
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
      const formValues = FactoryLibraryItem({
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

const Wrapper = (formValues: ILibrary.DB, parentType: ParentType, navProps) => {
  const ReactStub = createRemixStub(
    [
      {
        index: true,
        Component: () => (
          <Provider {...useCommonStores().stores}>
            <ThemeProvider theme={Theme}>
              <LibraryForm
                formValues={formValues}
                parentType={parentType}
                {...navProps}
              />
            </ThemeProvider>
          </Provider>
        ),
      },
    ],
    { initialEntries: ['/'] },
  )

  return render(<ReactStub />)
}
