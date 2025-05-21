import '@testing-library/jest-dom/vitest'

import { createRemixStub } from '@remix-run/testing'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { FactoryLibraryItem } from 'src/test/factories/Library'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { describe, expect, it } from 'vitest'

import { LibraryForm } from './Library.form'

import type { MediaFile, Project } from 'oa-shared'

const Theme = testingThemeStyles

describe('Library form', () => {
  describe('Provides user information', () => {
    it('shows maximum file size', () => {
      // Arrange
      const project = FactoryLibraryItem()
      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(project)
      })

      // Assert
      expect(wrapper.getByText('Maximum file size 50MB')).toBeInTheDocument()
    })
  })

  describe('Invalid file warning', () => {
    it('Does not appear when submitting only fileLink', () => {
      // Arrange
      const project = FactoryLibraryItem()
      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(project, [], 'www.test.com')
      })

      // Assert
      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })

    it('Does not appear when submitting only files', () => {
      // Arrange
      const project = FactoryLibraryItem()

      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(project, [
          {
            id: '123',
            name: 'test-file.pdf',
            size: 12345,
          },
        ])
      })

      // Assert
      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()
    })

    it('Appears when submitting 2 file types', () => {
      // Arrange
      const project = FactoryLibraryItem()

      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(
          project,
          [
            {
              id: '123',
              name: 'test-file.pdf',
              size: 12345,
            },
          ],
          'www.test.com',
        )
      })

      // Assert
      expect(wrapper.queryByTestId('invalid-file-warning')).toBeInTheDocument()
    })

    it('Does not appear when files are removed and filelink added', async () => {
      // Arrange
      const project = FactoryLibraryItem()

      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(project, [
          {
            id: '123',
            name: 'test-file.pdf',
            size: 12345,
          },
        ])
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

const Wrapper = (project: Project, files?: MediaFile[], fileLink?: string) => {
  const ReactStub = createRemixStub(
    [
      {
        index: true,
        Component: () => (
          <ThemeProvider theme={Theme}>
            <LibraryForm project={project} files={files} fileLink={fileLink} />
          </ThemeProvider>
        ),
      },
    ],
    { initialEntries: ['/'] },
  )

  return render(<ReactStub />)
}
