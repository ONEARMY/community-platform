import { render, screen } from '@testing-library/react'

import { HowtoProvider } from 'src/test/components'
import { HowtoErrors } from '.'

describe('HowtoErrors', () => {
  it('renders component when visible and has intro errors', async () => {
    const titleError = 'Make sure this field is filled correctly'

    const errors = {
      title: titleError,
    }

    render(
      <HowtoProvider>
        <HowtoErrors isVisible={true} errors={errors} />
      </HowtoProvider>,
    )

    await screen.findByText(titleError, { exact: false })
  })

  it('renders component when visible and has step errors', async () => {
    const text = 'Make sure this other field correctly'

    const errors = {
      steps: [{}, { text }],
    }

    render(
      <HowtoProvider>
        <HowtoErrors isVisible={true} errors={errors} />
      </HowtoProvider>,
    )

    await screen.findByText(text, { exact: false })
    await screen.findByText('Step 2')
  })

  it('renders nothing when not visible', async () => {
    const errors = {
      title: 'Make sure this field is filled correctly',
    }

    const { container } = render(
      <HowtoProvider>
        <HowtoErrors isVisible={false} errors={errors} />
      </HowtoProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
