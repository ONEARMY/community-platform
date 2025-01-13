import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'

import { HowtoFieldFiles } from './LibraryFiles.field'
import { HowtoFormProvider } from './LibraryFormProvider'

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
      <HowtoFormProvider>
        <HowtoFieldFiles {...props} />
      </HowtoFormProvider>,
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
