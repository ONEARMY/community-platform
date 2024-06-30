import { render, screen } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { describe, it, vi } from 'vitest'

import { useCommonStores } from '../../../common/hooks/useCommonStores'
import { FactoryUser } from '../../../test/factories/User'
import { ImpactMissing } from './ImpactMissing'
import { invisible, missing, reportYearLabel } from './labels'

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

describe('ImpactMissing', () => {
  describe('[public]', () => {
    it('renders message that impact is missing', async () => {
      render(
        <Provider {...useCommonStores().stores}>
          <ImpactMissing
            fields={undefined}
            owner={undefined}
            year={2023}
            visibleFields={undefined}
          />
        </Provider>,
      )

      await screen.findByText(missing.user.label)
    })

    it('renders right message and button for impact report year', async () => {
      render(
        <Provider {...useCommonStores().stores}>
          <ImpactMissing
            fields={undefined}
            owner={undefined}
            year={2022}
            visibleFields={undefined}
          />
        </Provider>,
      )

      await screen.findByText(reportYearLabel)
      await screen.findByText(`2022 ${missing.user.link}`)
    })

    it('renders message that all data is invisible', async () => {
      const fields = [
        {
          id: 'volunteers',
          value: 45,
          isVisible: true,
        },
      ]

      render(
        <Provider {...useCommonStores().stores}>
          <ImpactMissing
            fields={fields}
            owner={undefined}
            year={2022}
            visibleFields={[]}
          />
        </Provider>,
      )
      await screen.findByText(invisible.user.label)
    })
  })

  describe('[page owner]', () => {
    it('renders right message for impact owner', async () => {
      const user = FactoryUser({ userName: 'activeUser' })

      render(
        <Provider {...useCommonStores().stores}>
          <ImpactMissing
            fields={undefined}
            owner={user}
            year={2023}
            visibleFields={undefined}
          />
        </Provider>,
      )

      await screen.findByText(missing.owner.label)
    })
  })
})
