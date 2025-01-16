import '@testing-library/jest-dom/vitest'

import { act, waitFor } from '@testing-library/react'
import { ProfileTypeList } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { FormProvider } from './__mocks__/FormProvider'
import { SettingsPageImpact } from './SettingsPageImpact'

let mockUser = FactoryUser()

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

describe('SettingsPageImpact', () => {
  it('renders existing and missing impact', async () => {
    mockUser = FactoryUser({
      profileType: ProfileTypeList.SPACE,
      impact: {
        2023: [
          {
            id: 'plastic',
            value: 43000,
            isVisible: true,
          },
          {
            id: 'volunteers',
            value: 45,
            isVisible: false,
          },
        ],
      },
    })
    // Act
    let wrapper
    act(() => {
      wrapper = FormProvider(mockUser, <SettingsPageImpact />)
    })

    await waitFor(() => {
      expect(
        wrapper.getAllByText('43,000 Kg of plastic', { exact: false }),
      ).toHaveLength(1)
      expect(wrapper.getAllByAltText('icon')[1].src).toContain('eye.svg')
      expect(
        wrapper.getAllByText('45 volunteers', { exact: false }),
      ).toHaveLength(1)
      expect(wrapper.getAllByAltText('icon')[3].src).toContain(
        'eye-crossed.svg',
      )

      expect(wrapper.getAllByText('Edit data', { exact: false })).toHaveLength(
        6,
      )
      expect(
        wrapper.getAllByText('Do you have impact data for this year?'),
      ).toHaveLength(5)
    })
  })
})
