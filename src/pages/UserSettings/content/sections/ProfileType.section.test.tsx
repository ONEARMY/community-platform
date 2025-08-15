import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { SettingsFormProvider } from 'src/test/components/SettingsFormProvider'
import { describe, expect, it, vi } from 'vitest'

import { headings } from '../../labels'
import { ProfileTypeSection } from './ProfileType.section'

import type { ProfileTag } from 'oa-shared'

vi.mock('src/services/profileTagsService', () => ({
  profileTagsService: {
    getAllTags: vi.fn().mockResolvedValue([
      { id: 1, name: 'member', profileType: 'member' },
      { id: 2, name: 'space', profileType: 'space' },
    ] as ProfileTag[]),
  },
}))

describe('Focus', () => {
  it('render focus section if less than 2 activities', () => {
    render(
      <SettingsFormProvider>
        <ProfileTypeSection
          profileTypes={[
            {
              id: 1,
              name: 'member',
              displayName: 'Member',
              description: 'Member desc',
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

    expect(screen.queryByText(headings.focus)).not.toBeInTheDocument()
  })

  it('does not render focus section more than 2 activities', () => {
    render(
      <SettingsFormProvider>
        <ProfileTypeSection
          profileTypes={[
            {
              id: 1,
              name: 'member',
              displayName: 'Member',
              description: 'Member desc',
              isSpace: false,
              imageUrl: '',
              mapPinName: '',
              order: 1,
              smallImageUrl: '',
            },
            {
              id: 2,
              name: 'space',
              displayName: 'Space',
              description: 'space desc',
              isSpace: true,
              imageUrl: '',
              mapPinName: '',
              order: 2,
              smallImageUrl: '',
            },
          ]}
        />
      </SettingsFormProvider>,
    )

    expect(screen.queryByText(headings.focus)).toBeInTheDocument()
  })
})
