import '@testing-library/jest-dom/vitest'

import { act, waitFor } from '@testing-library/react'
import { IModerationStatus, ProfileTypeList } from 'oa-shared'
import { FactoryMapPin } from 'src/test/factories/MapPin'
import { factoryImage, factoryLink, FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { FormProvider } from './__mocks__/FormProvider'
import { SettingsPageMapPin } from './SettingsPageMapPin'

import type { ILocation } from 'oa-shared'

const completeProfile = {
  about: 'A member',
  displayName: 'Jeffo',
  links: [factoryLink],
  profileType: ProfileTypeList.MEMBER,
  userImage: factoryImage,
}
let mockUser = FactoryUser()
let mockPin = FactoryMapPin()

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        activeUser: mockUser,
      },
      mapsStore: {
        getPin: vi.fn().mockResolvedValue(mockPin),
      },
      themeStore: {
        currentTheme: {
          id: 'string',
          siteName: 'string',
          logo: 'string',
          badge: 'string',
          avatar: 'string',
          academyResource: 'string',
          styles: {
            communityProgramURL: '',
          },
        },
      },
    },
  }),
}))

describe('SettingsPageMapPin', () => {
  it('renders for no pin', async () => {
    mockUser = FactoryUser(completeProfile)
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageMapPin />)
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
    const name = 'Super cool place'
    mockUser = FactoryUser({
      ...completeProfile,
      profileType: ProfileTypeList.MEMBER,
      location: {
        name,
        countryCode: 'br',
        latlng: { lng: 0, lat: 0 },
      } as ILocation,
    })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageMapPin />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('descriptionMember')).toHaveLength(1)
      expect(wrapper.queryAllByTestId('descriptionSpace')).toHaveLength(0)
      expect(wrapper.getAllByTestId('LocationDataTextDisplay')).toHaveLength(1)
      expect(wrapper.getAllByText(name, { exact: false })).toHaveLength(1)
    })
  })

  it('renders for space', async () => {
    const comments = 'Need a better name'
    const name = 'Super cool place'

    mockPin = FactoryMapPin({
      comments,
      moderation: IModerationStatus.IMPROVEMENTS_NEEDED,
    })

    mockUser = FactoryUser({
      about: 'An important space',
      displayName: 'Jeffo',
      links: [factoryLink],
      profileType: ProfileTypeList.COMMUNITY_BUILDER,
      coverImages: [factoryImage],
      location: {
        name,
        countryCode: 'br',
        latlng: { lng: 0, lat: 0 },
      } as ILocation,
    })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageMapPin />)
    })

    await waitFor(() => {
      expect(wrapper.queryAllByTestId('descriptionMember')).toHaveLength(0)
      expect(wrapper.getAllByTestId('descriptionSpace')).toHaveLength(1)
      expect(
        wrapper.getAllByTestId('WorkspaceMapPinRequiredStars'),
      ).toHaveLength(1)
      expect(wrapper.getAllByTestId('LocationDataTextDisplay')).toHaveLength(1)
      expect(wrapper.getAllByText(name, { exact: false })).toHaveLength(1)
      expect(wrapper.getAllByText(comments, { exact: false })).toHaveLength(1)
    })
  })

  it('renders for user with incomplete profile', async () => {
    mockUser = FactoryUser({
      displayName: 'Jeffo',
      links: [factoryLink],
      profileType: ProfileTypeList.MEMBER,
      userImage: factoryImage,
    })

    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageMapPin />)
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
