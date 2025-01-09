import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { LibraryFormProvider } from './LibraryFormProvider'
import { LibraryStepsContainerField } from './LibraryStepsContainer.field'

describe('HowtoFieldStepsContainer', () => {
  it('renders', async () => {
    render(
      <LibraryFormProvider>
        <LibraryStepsContainerField />
      </LibraryFormProvider>,
    )

    await screen.findByText('Add step')
  })
  // Will add behavioural test when #2698 is merged in; adding steps
})
