import { render } from '@testing-library/react'
import { UserRole } from 'oa-shared'
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { AuthWrapper } from './AuthWrapper'

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({
    profile: FactoryUser({
      roles: [UserRole.BETA_TESTER],
    }),
  }),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

describe('AuthWrapper', () => {
  it('renders fallback when user is not authorized', () => {
    const { getByText } = render(
      <ProfileStoreProvider>
        <AuthWrapper
          roleRequired={UserRole.ADMIN}
          fallback={<div>Fallback Content</div>}
        >
          <div>Test Content</div>
        </AuthWrapper>
      </ProfileStoreProvider>,
    )
    expect(getByText('Fallback Content')).toBeTruthy()
  })

  it('renders child components when user is authorized with role array', () => {
    const { getByText } = render(
      <ProfileStoreProvider>
        <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
          <div>Test Content</div>
        </AuthWrapper>
      </ProfileStoreProvider>,
    )
    expect(getByText('Test Content')).toBeTruthy()
  })

  it('renders child components when user is authorized with role string', () => {
    const { getByText } = render(
      <ProfileStoreProvider>
        <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
          <div>Test Content</div>
        </AuthWrapper>
      </ProfileStoreProvider>,
    )
    expect(getByText('Test Content')).toBeTruthy()
  })

  it('renders child components when user exists but no roles specified', () => {
    const { getByText } = render(
      <ProfileStoreProvider>
        <AuthWrapper roleRequired={[]}>
          <div>Test Content</div>
        </AuthWrapper>
      </ProfileStoreProvider>,
    )
    expect(getByText('Test Content')).toBeTruthy()
  })
})
