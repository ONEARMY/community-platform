import '@testing-library/jest-dom/vitest'

import { faker } from '@faker-js/faker'
import { act, waitFor } from '@testing-library/react'
import { FactoryUser } from 'src/test/factories/User'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FormProvider } from './__mocks__/FormProvider'
import { SettingsPageUserProfile } from './SettingsPageUserProfile'

import type { ProfileType } from 'oa-shared'

const mockUseProfileStore = vi.hoisted(() => vi.fn())

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

describe('UserSettings', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders fields for member', async () => {
    const mockUser = FactoryUser({
      type: {
        id: 1,
        name: 'Member',
        isSpace: false,
      } as ProfileType,
    })
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })

    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('photo')).toHaveLength(1)
      expect(wrapper.queryByTestId('coverImage')).toBeNull()
    })
  })

  it('renders fields for collection point', async () => {
    const mockUser = FactoryUser({
      type: {
        id: 1,
        name: 'collection-point',
        isSpace: true,
      } as ProfileType,
      coverImages: [
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
      ],
    })
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })

    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('photo')).toHaveLength(1)
      expect(wrapper.getAllByTestId('coverImage')).toHaveLength(1)
    })
  })

  it('renders fields for community builder', async () => {
    const mockUser = FactoryUser({
      type: {
        id: 1,
        name: 'community-builder',
        isSpace: true,
      } as ProfileType,
      coverImages: [
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
      ],
    })
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })

    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('photo')).toHaveLength(1)
      expect(wrapper.getAllByTestId('coverImage')).toHaveLength(1)
    })
  })

  it('renders fields for machine builder', async () => {
    const mockUser = FactoryUser({
      type: {
        id: 1,
        name: 'machine-builder',
        isSpace: true,
      } as ProfileType,
      coverImages: [
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
      ],
    })
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })

    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('photo')).toHaveLength(1)
      expect(wrapper.getAllByTestId('coverImage')).toHaveLength(2)
    })
  })

  it('renders fields for space', async () => {
    const mockUser = FactoryUser({
      type: {
        id: 1,
        name: 'space',
        isSpace: true,
      } as ProfileType,
      coverImages: [
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
      ],
    })
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })

    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('photo')).toHaveLength(1)
      expect(wrapper.getAllByTestId('coverImage')).toHaveLength(4)
    })
  })

  it('renders fields for workspace', async () => {
    const mockUser = FactoryUser({
      type: {
        id: 1,
        name: 'workspace',
        isSpace: true,
      } as ProfileType,
      coverImages: [
        {
          id: '',
          publicUrl: faker.image.avatar(),
        },
      ],
    })
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })

    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('photo')).toHaveLength(1)
      expect(wrapper.getAllByTestId('coverImage')).toHaveLength(1)
    })
  })
})
