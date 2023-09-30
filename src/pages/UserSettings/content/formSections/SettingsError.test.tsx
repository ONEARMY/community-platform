import { render, screen } from '@testing-library/react'

import { SettingsProvider } from 'src/test/components'
import { SettingsErrors } from 'src/pages/UserSettings/content/formSections/SettingsErrors'

describe('SettingsErrors', () => {
  it('renders component when visible and has errors', async () => {
    const error = 'Make sure this field is filled correctly'

    const errors = {
      activities: error,
    }

    render(
      <SettingsProvider>
        <SettingsErrors isVisible={true} errors={errors} />
      </SettingsProvider>,
    )

    await screen.findByText(error, { exact: false })
  })

  it('flattens nested errors with the default message', async () => {
    const errors = {
      links: [
        {
          label: 'Fill this in',
          type: 'Fill this in',
        },
      ],
    }

    render(
      <SettingsProvider>
        <SettingsErrors isVisible={true} errors={errors} />
      </SettingsProvider>,
    )

    await screen.findByText('Make sure this field is filled correctly', {
      exact: false,
    })
  })

  it('renders nothing when not visible', async () => {
    const errors = {
      title: 'Make sure this field is filled correctly',
    }

    const { container } = render(
      <SettingsProvider>
        <SettingsErrors isVisible={false} errors={errors} />
      </SettingsProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
