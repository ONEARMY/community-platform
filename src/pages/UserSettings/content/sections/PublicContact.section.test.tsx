import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { PublicContactSection } from 'src/pages/UserSettings/content/sections/PublicContact.section'
import { SettingsFormProvider } from 'src/test/components/SettingsFormProvider'
import { describe, expect, it } from 'vitest'

describe('PublicContact', () => {
  it('renders unchecked when isContactableByPublic is false', async () => {
    const isContactableByPublic = false

    render(
      <SettingsFormProvider>
        <PublicContactSection isContactableByPublic={isContactableByPublic} />
      </SettingsFormProvider>,
    )

    expect(screen.getByTestId('isContactableByPublic')).not.toBeChecked()
  })

  it('renders checked when isContactableByPublic is true', async () => {
    const isContactableByPublic = true

    render(
      <SettingsFormProvider>
        <PublicContactSection isContactableByPublic={isContactableByPublic} />
      </SettingsFormProvider>,
    )

    expect(screen.getByTestId('isContactableByPublic')).toBeChecked()
  })
})
