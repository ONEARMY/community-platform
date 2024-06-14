import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ImpactField } from './ImpactField'

describe('ImpactField', () => {
  it('renders field with expected question data', async () => {
    const field = {
      id: 'plastic',
      value: 23000,
      isVisible: true,
    }

    render(<ImpactField field={field} />)

    await screen.findByText('23,000 Kg of plastic recycled')
  })

  it('renders nothing when field is not set to be visible', async () => {
    const field = {
      id: 'plastic',
      value: 3,
      isVisible: false,
    }

    const { container } = render(<ImpactField field={field} />)

    expect(container.innerHTML).toBe('')
  })

  it("renders nothing when field isn't found in question data", async () => {
    const field = {
      id: 'nothing',
      value: 3,
      isVisible: true,
    }

    const { container } = render(<ImpactField field={field} />)

    expect(container.innerHTML).toBe('')
  })
})
