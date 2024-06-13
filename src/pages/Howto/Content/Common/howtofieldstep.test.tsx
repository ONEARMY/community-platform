import { render, screen } from '@testing-library/react'
import { HowtoProvider } from 'src/test/components'
import { describe, it, vi } from 'vitest'

import { HowtoFieldStep } from '.'

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
      <HowtoProvider>
        <HowtoFieldStep {...props} />
      </HowtoProvider>,
    )

    await screen.findByText('Step 1 *')
  })
})
