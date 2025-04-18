import '@testing-library/jest-dom/vitest'

import { act, waitFor } from '@testing-library/react'
import { ProfileTypeList } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FormProvider } from './__mocks__/FormProvider'
import { SettingsPageUserProfile } from './SettingsPageUserProfile'

let mockUser = FactoryUser({})

vi.mock('src/common/hooks/useCommonStores', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      userStore: {
        activeUser: mockUser,
      },
      tagsStore: {
        allTags: [],
      },
    },
  }),
}))

describe('UserSettings', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders fields for member', async () => {
    mockUser = FactoryUser({ profileType: ProfileTypeList.MEMBER })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.queryByTestId('cover-image')).toBeNull()
    })
  })

  it('renders fields for collection point', async () => {
    mockUser = FactoryUser({ profileType: ProfileTypeList.COLLECTION_POINT })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('renders fields for community builder', async () => {
    mockUser = FactoryUser({ profileType: ProfileTypeList.COMMUNITY_BUILDER })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('renders fields for machine builder', async () => {
    mockUser = FactoryUser({ profileType: ProfileTypeList.MACHINE_BUILDER })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('renders fields for space', async () => {
    mockUser = FactoryUser({ profileType: ProfileTypeList.SPACE })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('renders fields for workspace', async () => {
    mockUser = FactoryUser({ profileType: ProfileTypeList.WORKSPACE })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })
})
