import '@testing-library/jest-dom/vitest'

import { act, waitFor } from '@testing-library/react'
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
    },
  }),
}))

describe('UserSettings', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders fields for member', async () => {
    mockUser = FactoryUser({ profileType: 'member' })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.queryByTestId('workspaceType')).toBeNull()
      expect(wrapper.queryByTestId('CollectionSection')).toBeNull()
      expect(wrapper.queryByTestId('CollectionSection')).toBeNull()
      expect(wrapper.queryByTestId('ExpertiseSection')).toBeNull()
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.queryByTestId('PublicContactSection')).toBeNull()
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.queryByTestId('cover-image')).toBeNull()
    })
  })

  it('renders fields for collection point', async () => {
    mockUser = FactoryUser({ profileType: 'collection-point' })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.queryByTestId('workspaceType')).toBeNull()
      expect(wrapper.getAllByTestId('CollectionSection')).toHaveLength(1)
      expect(wrapper.queryByTestId('ExpertiseSection')).toBeNull()
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('renders fields for community builder', async () => {
    mockUser = FactoryUser({ profileType: 'community-builder' })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.queryByTestId('workspaceType')).toBeNull()
      expect(wrapper.queryByTestId('CollectionSection')).toBeNull()
      expect(wrapper.queryByTestId('ExpertiseSection')).toBeNull()
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('renders fields for machine builder', async () => {
    mockUser = FactoryUser({ profileType: 'machine-builder' })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.queryByTestId('workspaceType')).toBeNull()
      expect(wrapper.queryByTestId('CollectionSection')).toBeNull()
      expect(wrapper.getAllByTestId('ExpertiseSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('renders fields for space', async () => {
    mockUser = FactoryUser({ profileType: 'space' })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.queryByTestId('workspaceType')).toBeNull()
      expect(wrapper.queryByTestId('CollectionSection')).toBeNull()
      expect(wrapper.queryByTestId('ExpertiseSection')).toBeNull()
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })

  it('renders fields for workspace', async () => {
    mockUser = FactoryUser({ profileType: 'workspace' })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageUserProfile />)
    })

    await waitFor(() => {
      expect(wrapper.getAllByTestId('workspaceType')).toHaveLength(1)
      expect(wrapper.queryByTestId('CollectionSection')).toBeNull()
      expect(wrapper.queryByTestId('ExpertiseSection')).toBeNull()
      expect(wrapper.getAllByTestId('UserInfosSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('PublicContactSection')).toHaveLength(1)
      expect(wrapper.getAllByTestId('userImage')).toHaveLength(1)
      expect(wrapper.getAllByTestId('cover-image')).toHaveLength(4)
    })
  })
})
