import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { HowtoFieldStepsContainer } from './HowtoFieldStepsContainer'
import { HowtoFormProvider } from './HowtoFormProvider'

describe('HowtoFieldStepsContainer', () => {
  it('renders', async () => {
    render(
      <HowtoFormProvider>
        <HowtoFieldStepsContainer />
      </HowtoFormProvider>,
    )

    await screen.findByText('Add step')
  })
  // Will add behavioural test when #2698 is merged in; adding steps
})
