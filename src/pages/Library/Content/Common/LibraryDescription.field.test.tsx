import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { HowtoFieldDescription } from './LibraryDescription.field'
import { HowtoFormProvider } from './LibraryFormProvider'

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
