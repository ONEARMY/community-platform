import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { HowtoProvider } from '../../../../test/components'
import { HowtoFieldDescription } from './HowtoFieldDescription'

describe('HowtoFieldStepsDescription', () => {
  it('renders', async () => {
    render(
      <HowtoProvider>
        <HowtoFieldDescription />
      </HowtoProvider>,
    )

    await screen.findByText('Short description *')
  })
  // Will add behavioural test when #2698 is merged in; 1000 character cap
})
