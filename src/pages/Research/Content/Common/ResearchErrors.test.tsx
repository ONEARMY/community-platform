import { render, screen } from '@testing-library/react'

import { ResearchProvider } from 'src/test/components'
import { ResearchErrors } from '.'

describe('ResearchErrors', () => {
  it('renders component when visible and has intro errors', async () => {
    const descriptionError = 'Make sure this field is filled correctly'
    const descriptionTitle = 'Description'
    const errors = {
      description: descriptionError,
    }
    const labels = {
      description: {
        title: descriptionTitle,
      },
    }

    render(
      <ResearchProvider>
        <ResearchErrors isVisible={true} errors={errors} labels={labels} />
      </ResearchProvider>,
    )

    await screen.findByText(descriptionError, { exact: false })
    await screen.findByText(descriptionTitle, { exact: false })
  })

  it('renders nothing when not visible', async () => {
    const errors = {}
    const labels = {}

    const { container } = render(
      <ResearchProvider>
        <ResearchErrors isVisible={false} errors={errors} labels={labels} />
      </ResearchProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
