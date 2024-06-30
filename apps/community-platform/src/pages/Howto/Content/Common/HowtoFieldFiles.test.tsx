import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'

import { guidance } from '../../../../pages/Howto/labels'
import { HowtoProvider } from '../../../../test/components'
import { FactoryCategory } from '../../../../test/factories/Category'
import { HowtoFieldFiles } from './HowtoFieldFiles'

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
      <HowtoProvider>
        <HowtoFieldFiles {...props} />
      </HowtoProvider>,
    )

    await screen.findByText(
      'Do you have supporting files to help others replicate your How-to?',
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
      <HowtoProvider>
        <HowtoFieldFiles {...props} />
      </HowtoProvider>,
    )

    await screen.findByText(guidance.moulds.files)
  })

  // Will add behavioural test when #2698 is merged in:
  // - File editmode
  // - onClick called on click
  // - Show error message
})
