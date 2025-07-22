import '@testing-library/jest-dom/vitest'

import { faker } from '@faker-js/faker'
import { act, waitFor } from '@testing-library/react'
import { ProfileTypeList } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FormProvider } from './__mocks__/FormProvider'
import { SettingsPageUserProfile } from './SettingsPageUserProfile'

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
    const mockUser = FactoryUser({ type: ProfileTypeList.MEMBER })
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
      type: ProfileTypeList.COLLECTION_POINT,
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
      type: ProfileTypeList.COMMUNITY_BUILDER,
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
      type: ProfileTypeList.MACHINE_BUILDER,
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
      type: ProfileTypeList.SPACE,
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
      type: ProfileTypeList.WORKSPACE,
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
