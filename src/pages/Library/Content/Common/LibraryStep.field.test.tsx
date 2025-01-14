import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'

import { HowtoFormProvider } from './LibraryFormProvider'
import { HowtoFieldStep } from './LibraryStep.field'

describe('HowtoFieldStep', () => {
  it('renders', async () => {
    const props = {
      step: [],
      index: 0,
      images: [],
      onDelete: vi.fn(() => null),
      moveStep: vi.fn(() => null),
    }

    render(
      <HowtoFormProvider>
        <HowtoFieldStep {...props} />
      </HowtoFormProvider>,
    )

    await screen.findByText('Step 1 *')
  })
})
