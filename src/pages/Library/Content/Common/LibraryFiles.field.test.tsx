import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'

import { LibraryFilesField } from './LibraryFiles.field'
import { LibraryFormProvider } from './LibraryFormProvider'

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

describe('HowtoFieldFiles', () => {
  it('renders with no guidance category provided', async () => {
    const props = {
      category: undefined,
      fileEditMode: true,
      files: [],
      onClick: vi.fn(),
      showInvalidFileWarning: false,
    }

    render(
      <LibraryFormProvider>
        <LibraryFilesField {...props} />
      </LibraryFormProvider>,
    )

    await screen.findByText(
      'Do you have supporting files to help others replicate your project?',
    )
  })

  // Will add behavioural test when #2698 is merged in:
  // - File editmode
  // - onClick called on click
  // - Show error message
})
