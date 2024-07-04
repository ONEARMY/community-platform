import { render, screen } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { describe, expect, it, vi } from 'vitest'

import { useCommonStores } from '../../../common/hooks/useCommonStores'
import { FactoryUser } from '../../../test/factories/User'
import { ImpactItem } from './ImpactItem'

vi.mock('../../../common/hooks/useCommonStores', () => {
  return {
    useCommonStores: () => ({
      stores: {
        userStore: {
          activeUser: { userName: 'activeUser' },
        },
      },
    }),
  }
})

describe('ImpactItem', () => {
  it('renders an impact item with visible fields for a specific year, with impact fields in order: plastic, revenue, employees, volunteers, machines ', async () => {
    const user = FactoryUser({ userName: 'activeUser' })
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
      <Provider {...useCommonStores().stores}>
        <ImpactItem fields={fields} user={user} year={2022} />
      </Provider>,
    )
    const plasticItem = await screen.findByText('30,000 Kg of plastic recycled')
    const revenueItem = await screen.findByText('USD 54,000 revenue')

    expect(plasticItem.compareDocumentPosition(revenueItem)).toBe(4)
  })
})
