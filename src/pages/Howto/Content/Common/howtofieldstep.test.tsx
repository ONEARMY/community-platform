import { render, screen } from '@testing-library/react'
import { HowtoProvider } from 'src/test/components'

import { HowtoFieldStep } from '.'

describe('HowtoFieldStep', () => {
  it('renders', async () => {
    const props = {
      step: [],
      index: 0,
      images: [],
      onDelete: jest.fn(() => null),
      moveStep: jest.fn(() => null),
    }

    render(
      <HowtoProvider>
        <HowtoFieldStep {...props} />
      </HowtoProvider>,
    )

    await screen.findByText('Step 1 *')
  })
})
