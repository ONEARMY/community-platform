import { render, screen } from '@testing-library/react'
import { SettingsErrors } from 'src/pages/UserSettings/content/SettingsErrors'
import { SettingsFormProvider } from 'src/test/components/SettingsFormProvider'
import { describe, expect, it } from 'vitest'

describe('SettingsErrors', () => {
  it('renders component when visible and has errors', async () => {
    const error = 'Make sure this field is filled correctly'

    const errors = {
      activities: error,
    }

    render(
      <SettingsFormProvider>
        <SettingsErrors isVisible={true} errors={errors} />
      </SettingsFormProvider>,
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
      <SettingsFormProvider>
        <SettingsErrors isVisible={true} errors={errors} />
      </SettingsFormProvider>,
    )

    await screen.findByText('Make sure this field is filled correctly', {
      exact: false,
    })
  })

  it('renders nothing when not visible', () => {
    const errors = {
      title: 'Make sure this field is filled correctly',
    }

    const { container } = render(
      <SettingsFormProvider>
        <SettingsErrors isVisible={false} errors={errors} />
      </SettingsFormProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
