import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'

import { HowtoFormProvider } from './LibraryFormProvider'
import { HowtoFieldTitle } from './LibraryTitle.field'

import type { HowtoStore } from 'src/stores/Library/library.store'
import type { ParentType } from './Library.form'

vi.mock('src/stores/Library/library.store')
const store = await vi.importMock('src/stores/Library/library.store')

describe('HowtoFieldTitle', () => {
  it('renders', async () => {
    const props = {
      _id: 'random-123',
      parentType: 'create' as ParentType,
      store: store as any as HowtoStore,
    }

    render(
      <HowtoFormProvider>
        <HowtoFieldTitle {...props} />
      </HowtoFormProvider>,
    )

    await screen.findByText('0 / 50')
  })
  // Will add behavioural test when #2698 is merged in; can't add more than 50 characters
})
