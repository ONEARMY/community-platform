import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { HowtoFieldDescription } from './HowtoFieldDescription'
import { HowtoFormProvider } from './HowtoFormProvider'

describe('HowtoFieldStepsDescription', () => {
  it('renders', async () => {
    render(
      <HowtoFormProvider>
        <HowtoFieldDescription />
      </HowtoFormProvider>,
    )

    await screen.findByText('Short description *')
  })
  // Will add behavioural test when #2698 is merged in; 1000 character cap
})
