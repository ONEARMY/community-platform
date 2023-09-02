import { render, screen } from '@testing-library/react'
import { HowtoProvider } from 'src/test/components'

import { HowtoFieldStepsContainer } from '.'

describe('HowtoFieldStepsContainer', () => {
  it('renders', async () => {
    render(
      <HowtoProvider>
        <HowtoFieldStepsContainer />
      </HowtoProvider>,
    )

    await screen.findByText('Add step')
  })
  // Will add behavioural test when #2698 is merged in; adding steps
})
