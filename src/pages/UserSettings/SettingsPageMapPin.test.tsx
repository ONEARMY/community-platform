import '@testing-library/jest-dom/vitest'

import { act, waitFor } from '@testing-library/react'
import { ProfileTypeList } from 'oa-shared'
import { FactoryMapPin } from 'src/test/factories/MapPin'
import { factoryImage, FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { FormProvider } from './__mocks__/FormProvider'
import { SettingsPageMapPin } from './SettingsPageMapPin'

import type { PinProfile } from 'oa-shared'

const completeProfile = {
  about: 'A member',
  displayName: 'Jeffo',
  website: 'www.example.com',
  type: ProfileTypeList.MEMBER,
  photo: factoryImage,
}
const mockUseProfileStore = vi.hoisted(() => vi.fn())
const mockGetMapPinById = vi.hoisted(() => vi.fn())
const mockGetCurrentUserMapPin = vi.hoisted(() => vi.fn())

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

vi.mock('../Maps/map.service', () => ({
  mapPinService: {
    getMapPinById: mockGetMapPinById,
    getCurrentUserMapPin: mockGetCurrentUserMapPin,
  },
}))

describe('SettingsPageMapPin', () => {
  it('renders for no pin', async () => {
    const mockUser = FactoryUser(completeProfile)
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('NoLocationDataTextDisplay')).toHaveLength(
        1,
      )
      expect(wrapper.queryAllByTestId('LocationDataTextDisplay')).toHaveLength(
        0,
      )
    })
  })

  it('renders for member', async () => {
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('descriptionMember')).toHaveLength(1)
      expect(wrapper.queryAllByTestId('descriptionSpace')).toHaveLength(0)
    })
  })

  it('renders for space', async () => {
    const moderationFeedback = 'Need a better name'
    const name = 'Super cool place'
    const mockUser = FactoryUser({
      about: 'An important space',
      displayName: 'Jeffo',
      type: ProfileTypeList.COMMUNITY_BUILDER,
      coverImages: [factoryImage],
    })
    const mockPin = FactoryMapPin({
      name,
      moderation: 'improvements-needed',
      moderationFeedback,
      profile: mockUser as PinProfile,
    })

    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })
    mockGetMapPinById.mockResolvedValue(mockPin) // Mock a pin for a space

    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />)
    })

    await waitFor(() => {
      expect(wrapper.queryAllByTestId('descriptionMember')).toHaveLength(0)
      expect(wrapper.getAllByTestId('descriptionSpace')).toHaveLength(1)
      expect(
        wrapper.getAllByTestId('WorkspaceMapPinRequiredStars'),
      ).toHaveLength(1)
      expect(wrapper.getAllByText(name, { exact: false })).toHaveLength(1)
      expect(
        wrapper.getAllByText(moderationFeedback, { exact: false }),
      ).toHaveLength(1)
    })
  })

  it('renders for user with incomplete profile', async () => {
    const mockUser = FactoryUser({
      displayName: 'Jeffo',
      type: ProfileTypeList.MEMBER,
      photo: factoryImage,
    })
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    })

    let wrapper
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />)
    })

    await waitFor(() => {
      expect(
        wrapper.queryAllByTestId('IncompleteProfileTextDisplay'),
      ).toHaveLength(1)
      expect(wrapper.queryAllByTestId('complete-profile-button')).toHaveLength(
        1,
      )
    })
  })
})
