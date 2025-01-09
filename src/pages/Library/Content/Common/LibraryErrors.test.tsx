import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LibraryErrors } from './LibraryErrors'
import { LibraryFormProvider } from './LibraryFormProvider'

describe('HowtoErrors', () => {
  it('renders component when visible and has intro errors', async () => {
    const titleError = 'Make sure this field is filled correctly'

    const errors = {
      title: titleError,
    }

    render(
      <LibraryFormProvider>
        <LibraryErrors isVisible={true} errors={errors} />
      </LibraryFormProvider>,
    )

    await screen.findByText(titleError, { exact: false })
  })

  it('renders component when visible and has step errors', async () => {
    const text = 'Make sure this other field correctly'

    const errors = {
      steps: [{}, { text }],
    }

    render(
      <LibraryFormProvider>
        <LibraryErrors isVisible={true} errors={errors} />
      </LibraryFormProvider>,
    )

    await screen.findByText(text, { exact: false })
    await screen.findByText('Step 2')
  })

  it('renders nothing when not visible', () => {
    const errors = {
      title: 'Make sure this field is filled correctly',
    }

    const { container } = render(
      <LibraryFormProvider>
        <LibraryErrors isVisible={false} errors={errors} />
      </LibraryFormProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
