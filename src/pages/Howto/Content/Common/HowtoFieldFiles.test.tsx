import { render, screen } from '@testing-library/react'
import { guidance } from 'src/pages/Howto/labels'
import { FactoryCategory } from 'src/test/factories/Category'
import { describe, it, vi } from 'vitest'

import { HowtoFieldFiles } from './HowtoFieldFiles'
import { HowtoFormProvider } from './HowtoFormProvider'

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

  it('renders with guidance category provided', async () => {
    const props = {
      category: FactoryCategory,
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

    await screen.findByText(guidance.moulds.files)
  })

  // Will add behavioural test when #2698 is merged in:
  // - File editmode
  // - onClick called on click
  // - Show error message
})
