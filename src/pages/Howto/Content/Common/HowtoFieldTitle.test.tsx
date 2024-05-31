import { render, screen } from '@testing-library/react'
import { HowtoProvider } from 'src/test/components'
import { describe, it, vi } from 'vitest'

import { HowtoFieldTitle } from '.'

import type { HowtoStore } from 'src/stores/Howto/howto.store'
import type { ParentType } from './Howto.form'

vi.mock('src/stores/Howto/howto.store')
const store = await vi.importMock('src/stores/Howto/howto.store')

describe('HowtoFieldTitle', () => {
  it('renders', async () => {
    const props = {
      _id: 'random-123',
      parentType: 'create' as ParentType,
      store: store as HowtoStore,
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
