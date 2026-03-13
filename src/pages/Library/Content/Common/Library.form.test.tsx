import '@testing-library/jest-dom/vitest';
import { createRoutesStub } from 'react-router';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store';
import { FactoryProjectFormData } from 'src/test/factories/Library';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LibraryForm } from './LibraryForm';
import type { ProjectFormData, IMediaFile } from 'oa-shared';
import { theme } from 'oa-themes';

// Mock timers to prevent async operations from running after tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  // Clean up any pending timers
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  cleanup();
});

describe('Library form', () => {
  describe('Provides user information', () => {
    it('shows maximum file size', () => {
      // Arrange
      const project = FactoryProjectFormData();
      // Act
      let wrapper;
      act(() => {
        wrapper = Wrapper(project);
      });

      // Assert
      expect(wrapper.getByText('Maximum file size 50MB')).toBeInTheDocument();

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers();
      });
    });
  });

  describe('Invalid file warning', () => {
    it('Does not appear when submitting only fileLink', () => {
      // Arrange
      const project = FactoryProjectFormData({
        fileLink: 'www.test.com',
        files: null,
      });
      // Act
      let wrapper;
      act(() => {
        wrapper = Wrapper(project);
      });

      // Assert
      expect(wrapper.queryByTestId('invalid-file-warning')).not.toBeInTheDocument();

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers();
      });
    });

    it('Does not appear when submitting only files', () => {
      // Arrange
      const project = FactoryProjectFormData({
        files: [
          {
            id: '123',
            name: 'test-file.pdf',
            size: 12345,
          },
        ],
        fileLink: null,
      });

      // Act
      let wrapper;
      act(() => {
        wrapper = Wrapper(project);
      });

      // Assert
      expect(wrapper.queryByTestId('invalid-file-warning')).not.toBeInTheDocument();

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers();
      });
    });

    it('Appears when submitting 2 file types', () => {
      // Arrange
      const project = FactoryProjectFormData({
        files: [
          {
            id: '123',
            name: 'test-file.pdf',
            size: 12345,
          },
        ],
        fileLink: 'www.test.com',
      });

      // Act
      let wrapper;
      act(() => {
        wrapper = Wrapper(project);
      });

      // Assert
      expect(wrapper.queryByTestId('invalid-file-warning')).toBeInTheDocument();

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers();
      });
    });

    it('Does not appear when files are removed and filelink added', async () => {
      // Arrange
      const project = FactoryProjectFormData({
        files: [
          {
            id: '123',
            name: 'test-file.pdf',
            size: 12345,
          },
        ],
        fileLink: null,
      });

      // Act
      let wrapper;
      act(() => {
        wrapper = Wrapper(project);
      });

      // clear files
      expect(wrapper.queryByTestId('remove-file')).toBeInTheDocument();

      const removeFileButton = wrapper.getByTestId('remove-file');
      fireEvent.click(removeFileButton);

      // add fileLink
      const fileLink = wrapper.getByPlaceholderText('Link to Google Drive, Dropbox, Grabcad etc');
      fireEvent.change(fileLink, {
        target: { value: '<http://www.test.com>' },
      });

      // Assert
      expect(wrapper.queryByTestId('invalid-file-warning')).not.toBeInTheDocument();

      // Clean up any pending timers before test completes
      act(() => {
        vi.runAllTimers();
      });
    });
  });
});

const Wrapper = (project: ProjectFormData) => {
  const ReactStub = createRoutesStub(
    [
      {
        index: true,
        Component: () => (
          <ProfileStoreProvider>
            <ThemeProvider theme={theme}>
              <LibraryForm formData={project} id={null} />
            </ThemeProvider>
          </ProfileStoreProvider>
        ),
      },
    ],
    { initialEntries: ['/'] },
  );

  return render(<ReactStub />);
};
