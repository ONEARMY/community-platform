import { render, screen } from '@testing-library/react'
import { Provider } from 'mobx-react'

import { useCommonStores } from 'src/index'
import { FactoryUser } from 'src/test/factories/User'
import { missing } from './labels'
import { IMPACT_YEARS } from './constants'
import { Impact } from './Impact'

jest.mock('src/index', () => {
  return {
    useCommonStores: () => ({
      stores: {
        userStore: {
          activeUser: jest.fn(),
        },
      },
    }),
  }
})

describe('Impact', () => {
  it('renders all fields with data formatted correctly', async () => {
    const impact = {
      2022: [
        {
          label: 'volunteers',
          value: 45,
          isVisible: true,
        },
        {
          label: 'plastic recycled',
          suffix: 'Kg of',
          value: 23000,
          isVisible: true,
        },
        {
          label: 'revenue',
          prefix: '$',
          value: 54000,
          isVisible: true,
        },
        {
          label: 'machines built',
          value: 13,
          isVisible: false,
        },
      ],
    }
    const user = FactoryUser({ impact })

    render(
      <Provider {...useCommonStores().stores}>
        <Impact impact={impact} user={user} />
      </Provider>,
    )

    await screen.findByText('45 volunteers')
    await screen.findByText('23,000 Kg of plastic recycled')
    await screen.findByText('$ 54,000 revenue')
    const machineField = await screen.queryByText('13 machines built')
    expect(machineField).toBe(null)

    await IMPACT_YEARS.forEach(async (year) => await screen.findByText(year))
    await screen.findAllByText(missing.owner.label)
  })
})
