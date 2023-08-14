import { render, screen } from '@testing-library/react'

import { HowtoProvider } from 'src/test/components'
import { HowtoErrors } from '.'

describe('HowtoErrors', () => {
  it('renders component when visible and has errors', async () => {
    const errors = {
      title: 'Make sure this field is filled correctly',
    }

    render(
      <HowtoProvider>
        <HowtoErrors isVisible={true} errors={errors} />
      </HowtoProvider>,
    )

    await screen.findByText(errors.title, { exact: false })
  })

  it('renders errors for steps', async () => {
    const text = 'Make sure this field is filled correctly'
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
