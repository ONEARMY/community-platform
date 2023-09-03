import { render, screen } from '@testing-library/react'

import { ErrorsContainer } from './ErrorsContainer'

describe('ErrorsContainer', () => {
  it('renders component when visible and has intro errors', async () => {
    const descriptionError = 'Fill this in correctly'
    const descriptionTitle = 'This is the Description'
    const sectionTitle = 'Main section'

    const errorsListSet = [
      {
        errors: {
          description: descriptionError,
        },
        keys: ['description'],
        labels: {
          description: {
            title: descriptionTitle,
          },
        },
        title: sectionTitle,
      },
    ]
    render(<ErrorsContainer isVisible={true} errorsListSet={errorsListSet} />)

    await screen.findByText(descriptionTitle, { exact: false })
    await screen.findByText(descriptionError, { exact: false })
    await screen.findByText(sectionTitle, { exact: false })
  })

  it('renders nothing when not visible', async () => {
    const errorsListSet = [
      {
        errors: {},
        keys: [],
        labels: {},
      },
    ]
    const { container } = render(
      <ErrorsContainer isVisible={false} errorsListSet={errorsListSet} />,
    )

    expect(container.innerHTML).toBe('')
  })
})
