import { render, screen } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, vi } from 'vitest'

import { IMPACT_YEARS } from './constants'
import { Impact } from './Impact'
import { invisible, missing } from './labels'

vi.mock('src/common/hooks/useCommonStores', () => {
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

describe('Impact', () => {
  describe('[public]', () => {
    it('renders all fields with data formatted correctly', async () => {
      const impact = {
        2022: [
          {
            id: 'plastic',
            value: 23000,
            isVisible: true,
          },
          {
            id: 'revenue',
            value: 54000,
            isVisible: true,
          },
          {
            id: 'volunteers',
            value: 45,
            isVisible: true,
          },
          {
            id: 'machines',
            value: 13,
            isVisible: false,
          },
        ],
        2021: [
          {
            id: 'machines',
            value: 8,
            isVisible: false,
          },
        ],
      }

      render(
        <Provider {...useCommonStores().stores}>
          <Impact impact={impact} user={undefined} />
        </Provider>,
      )

      await screen.findByText('45 volunteers')
      await screen.findByText('23,000 Kg of plastic recycled')
      await screen.findByText('$ 54,000 revenue')
      const machineField = screen.queryByText('13 machines built')
      expect(machineField).toBe(null)

      for (const year of IMPACT_YEARS) {
        await screen.findByText(year)
      }

      await screen.findAllByText(missing.user.label)
      await screen.findAllByText(invisible.user.label)
    })
  })

  describe('[page owner]', () => {
    it('renders all fields with data formatted correctly', async () => {
      const impact = {
        2022: [
          {
            id: 'volunteers',
            value: 45,
            isVisible: true,
          },
        ],
        2021: [
          {
            id: 'volunteers',
            value: 45,
            isVisible: false,
          },
        ],
      }
      const user = FactoryUser({ impact, userName: 'activeUser' })

      render(
        <Provider {...useCommonStores().stores}>
          <Impact impact={impact} user={user} />
        </Provider>,
      )

      await screen.findAllByText(missing.owner.label)
      await screen.findAllByText(invisible.owner.label)
    })
  })
})
