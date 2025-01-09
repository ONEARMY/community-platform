import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'

import { LibraryFormProvider } from './LibraryFormProvider'
import { LibraryTitleField } from './LibraryTitle.field'

import type { LibraryStore } from 'src/stores/Library/library.store'
import type { ParentType } from './Library.form'

vi.mock('src/stores/Library/library.store')
const store = await vi.importMock('src/stores/Library/library.store')

describe('LibraryTitleField', () => {
  it('renders', async () => {
    const props = {
      _id: 'random-123',
      parentType: 'create' as ParentType,
      store: store as any as LibraryStore,
    }

    render(
      <LibraryFormProvider>
        <LibraryTitleField {...props} />
      </LibraryFormProvider>,
    )

    await screen.findByText('0 / 50')
  })
  // Will add behavioural test when #2698 is merged in; can't add more than 50 characters
})
