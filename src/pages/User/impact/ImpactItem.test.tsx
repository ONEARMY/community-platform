import { render, screen } from '@testing-library/react'
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { ImpactItem } from './ImpactItem'

import type { Profile } from 'oa-shared'

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({
    profile: FactoryUser({
      username: 'activeUser',
    }),
  }),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

describe('ImpactItem', () => {
  it('renders an impact item with visible fields for a specific year, with impact fields in order: plastic, revenue, employees, volunteers, machines ', async () => {
    const user = FactoryUser({ username: 'activeUser' })
    const fields = [
      {
        id: 'machines',
        value: 15,
        isVisible: true,
      },
      {
        id: 'revenue',
        value: 54000,
        isVisible: true,
      },
      { id: 'plastic', value: 30000, isVisible: true },
    ]
    render(
      <ProfileStoreProvider>
        <ImpactItem fields={fields} user={user as Profile} year={2022} />
      </ProfileStoreProvider>,
    )
    const plasticItem = await screen.findByText('30,000 Kg of plastic recycled')
    const revenueItem = await screen.findByText('USD 54,000 revenue')

    expect(plasticItem.compareDocumentPosition(revenueItem)).toBe(4)
  })
})
