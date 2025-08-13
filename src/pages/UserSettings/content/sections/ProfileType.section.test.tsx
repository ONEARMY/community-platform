import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { SettingsFormProvider } from 'src/test/components/SettingsFormProvider'
import { describe, expect, it } from 'vitest'

import { headings } from '../../labels'
import { ProfileTypeSection } from './ProfileType.section'

describe('Focus', () => {
  it('render focus section if more than one activity available', () => {
    render(
      <SettingsFormProvider>
        <ProfileTypeSection
          profileTypes={[
            {
              id: 1,
              name: 'test',
              displayName: 'Test',
              description: 'test desc',
              isSpace: false,
              imageUrl: '',
              mapPinName: '',
              order: 1,
              smallImageUrl: '',
            },
          ]}
        />
      </SettingsFormProvider>,
    )

    expect(screen.queryByText(headings.focus)).toBeInTheDocument()
  })

  it('does not render focus section if less than two activities available', () => {
    render(
      <SettingsFormProvider>
        <ProfileTypeSection
          profileTypes={[
            {
              id: 1,
              name: 'test',
              displayName: 'Test',
              description: 'test desc',
              isSpace: false,
              imageUrl: '',
              mapPinName: '',
              order: 1,
              smallImageUrl: '',
            },
            {
              id: 2,
              name: 'test 2',
              displayName: 'Test 2',
              description: 'test desc 2',
              isSpace: false,
              imageUrl: '',
              mapPinName: '',
              order: 2,
              smallImageUrl: '',
            },
          ]}
        />
      </SettingsFormProvider>,
    )

    expect(screen.queryByText(headings.focus)).not.toBeInTheDocument()
  })
})
