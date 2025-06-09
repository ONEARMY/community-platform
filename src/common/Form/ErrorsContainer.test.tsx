import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorsContainer } from './ErrorsContainer'

describe('ErrorsContainer', () => {
  it('renders component when visible and has intro errors', async () => {
    const descriptionError = 'Fill this in correctly'
    const descriptionTitle = 'This is the Description'
    const sectionTitle = 'Main section'

    const errorsListSet = [descriptionError]
    render(<ErrorsContainer errors={errorsListSet} />)

    await screen.findByText(descriptionTitle, { exact: false })
    await screen.findByText(descriptionError, { exact: false })
    await screen.findByText(sectionTitle, { exact: false })
  })

  it('renders nothing when not visible', async () => {
    const errorsListSet = []
    const { container } = render(<ErrorsContainer errors={errorsListSet} />)

    expect(container.innerHTML).toBe('')
  })
})
