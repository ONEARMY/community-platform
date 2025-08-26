import '@testing-library/jest-dom/vitest'

import { faker } from '@faker-js/faker'
import { act, waitFor } from '@testing-library/react'
import { FactoryUser } from 'src/test/factories/User'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FormProvider } from './__mocks__/FormProvider'
import { SettingsPageUserProfile } from './SettingsPageUserProfile'

import type { ProfileTag, ProfileType } from 'oa-shared'

const mockUseProfileStore = vi.hoisted(() => vi.fn())

const mockProfileTypes = [
  {
    id: 1,
    name: 'member',
    isSpace: false,
    description: 'Member',
    displayName: 'Member',
    imageUrl: '',
    mapPinName: '',
    order: 1,
    smallImageUrl: '',
  },
  {
    id: 2,
    name: 'collection-point',
    isSpace: true,
    description: 'Collection Point',
    displayName: 'Collection Point',
    imageUrl: '',
    mapPinName: '',
    order: 2,
    smallImageUrl: '',
  },
]

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

vi.mock('src/services/profileTypesService', () => ({
  profileTypesService: {
    getProfileTypes: vi.fn().mockResolvedValue(mockProfileTypes),
  },
}))

vi.mock('src/services/profileTagsService', () => ({
  profileTagsService: {
    getAllTags: vi.fn().mockResolvedValue([
      { id: 1, name: 'member', profileType: 'member' },
      { id: 2, name: 'space', profileType: 'space' },
    ] as ProfileTag[]),
  },
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
      profileTypes: mockProfileTypes,
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
    const avatarUrl = faker.image.avatar()
    const mockUser = FactoryUser({
      type: {
        id: 2,
        name: 'collection-point',
        description: 'Collection Point',
        displayName: 'Collection Point',
        imageUrl: '',
        mapPinName: '',
        order: 1,
        smallImageUrl: '',
        isSpace: true,
      } as ProfileType,
      coverImages: [
        {
          id: '123',
          publicUrl: avatarUrl,
        },
      ],
    })
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      profileTypes: mockProfileTypes,
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
