import '@testing-library/jest-dom/vitest'

import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TagList } from './TagsList'

vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: () => ({
    stores: {
      tagsStore: {
        allTagsByKey: {
          id1: { label: 'Hi' },
          id2: { label: 'Hello there' },
        },
      },
    },
  }),
}))

describe('TagList', () => {
  it('renders the labels of only the correct tags', () => {
    const tags = { id1: true }

    const { getByText } = render(<TagList tags={tags} />)

    expect(getByText('Hi')).toBeInTheDocument()
    expect(() => getByText('Hello there')).toThrow()
  })
})
