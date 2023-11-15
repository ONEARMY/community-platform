import { render, screen } from '@testing-library/react'

import { SettingsProvider } from 'src/test/components'
import { PublicContactSection } from 'src/pages/UserSettings/content/formSections/PublicContact.section'

describe('PublicContact', () => {
  it('renders unchecked when isContactableByPublic is false', async () => {
    const isContactableByPublic = false

    render(
      <SettingsProvider>
        <PublicContactSection isContactableByPublic={isContactableByPublic} />
      </SettingsProvider>,
    )

    expect(screen.getByTestId('isContactableByPublic')).not.toBeChecked()
  })

  it('renders checked when isContactableByPublic is true', async () => {
    const isContactableByPublic = true

    render(
      <SettingsProvider>
        <PublicContactSection isContactableByPublic={isContactableByPublic} />
      </SettingsProvider>,
    )

    expect(screen.getByTestId('isContactableByPublic')).toBeChecked()
  })
})
