import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'

import { HowtoProvider } from '../../../../test/components'
import { HowtoFieldTitle } from './HowtoFieldTitle'

import type { HowtoStore } from '../../../../stores/Howto/howto.store'
import type { ParentType } from './Howto.form'

vi.mock('../../../../stores/Howto/howto.store')

describe('HowtoFieldTitle', () => {
  let store: HowtoStore
  beforeAll(async () => {
    store = await vi.importMock('../../../../stores/Howto/howto.store')
  })

  it('renders', async () => {
    const props = {
      _id: 'random-123',
      parentType: 'create' as ParentType,
      store: store as any as HowtoStore,
    }

    render(
      <HowtoProvider>
        <HowtoFieldTitle {...props} />
      </HowtoProvider>,
    )

    await screen.findByText('0 / 50')
  })
  // Will add behavioural test when #2698 is merged in; can't add more than 50 characters
})
