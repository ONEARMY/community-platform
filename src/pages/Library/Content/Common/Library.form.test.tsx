import '@testing-library/jest-dom/vitest'

import { createRoutesStub } from 'react-router';
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store'
import { FactoryLibraryItem } from 'src/test/factories/Library'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LibraryForm } from './Library.form'

import type { MediaFile, Project } from 'oa-shared'

const Theme = testingThemeStyles

// Mock timers to prevent async operations from running after tests
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  // Clean up any pending timers
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
  cleanup()
})

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

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers()
      })
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

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers()
      })
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

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers()
      })
    })

    it('Appears when submitting 2 file types', () => {
      // Arrange
      const project = FactoryLibraryItem()

      const files = [
        {
          id: '123',
          name: 'test-file.pdf',
          size: 12345,
        },
      ]

      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(project, files, 'www.test.com')
      })

      // Assert
      expect(wrapper.queryByTestId('invalid-file-warning')).toBeInTheDocument()

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers()
      })
    })

    it('Does not appear when files are removed and filelink added', async () => {
      // Arrange
      const project = FactoryLibraryItem()
      const files = [
        {
          id: '123',
          name: 'test-file.pdf',
          size: 12345,
        },
      ]

      // Act
      let wrapper
      act(() => {
        wrapper = Wrapper(project, files)
      })

      // clear files
      expect(wrapper.queryByTestId('remove-file')).toBeInTheDocument()

      const removeFileButton = wrapper.getByTestId('remove-file')
      fireEvent.click(removeFileButton)

      // add fileLink
      const fileLink = wrapper.getByPlaceholderText(
        'Link to Google Drive, Dropbox, Grabcad etc',
      )
      fireEvent.change(fileLink, {
        target: { value: '<http://www.test.com>' },
      })

      // Assert
      expect(
        wrapper.queryByTestId('invalid-file-warning'),
      ).not.toBeInTheDocument()

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers()
      })
    })
  })
})

const Wrapper = (project: Project, files?: MediaFile[], fileLink?: string) => {
  const ReactStub = createRoutesStub(
    [
      {
        index: true,
        Component: () => (
          <ProfileStoreProvider>
            <ThemeProvider theme={Theme}>
              <LibraryForm
                project={project}
                files={files}
                fileLink={fileLink}
              />
            </ThemeProvider>
          </ProfileStoreProvider>
        ),
      },
    ],
    { initialEntries: ['/'] },
  )

  return render(<ReactStub />)
}
