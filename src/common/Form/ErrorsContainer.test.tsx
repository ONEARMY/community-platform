import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorsContainer } from './ErrorsContainer'

describe('ErrorsContainer', () => {
  it('renders component when visible and has intro errors', async () => {
    const descriptionError = 'Fill this in correctly'

    const errorsListSet = [descriptionError]
    render(<ErrorsContainer saving={errorsListSet} />)

    await screen.findByText(descriptionError, { exact: false })
  })

  it('renders nothing when not visible', async () => {
    const errorsListSet = []
    const { container } = render(<ErrorsContainer saving={errorsListSet} />)

    expect(container.innerHTML).toBe('')
  })
})
