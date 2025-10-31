import '@testing-library/jest-dom/vitest'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import {
  Basic,
  OnlyOne,
  WhenGlyphNotPresent,
} from './CategoryHorizonalList.stories'

import type { IProps } from './CategoryHorizonalList'

describe('CategoryHorizonalList', () => {
  // https://stackoverflow.com/a/62148101
  beforeEach(() => {
    window.IntersectionObserver = vi.fn().mockImplementation(function () {
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    })
  })

  it('renders each member type given', async () => {
    const { findAllByTestId } = render(<Basic {...(Basic.args as IProps)} />)

    const allItems = await findAllByTestId('CategoryHorizonalList-Item')

    expect(allItems).toHaveLength(12)
  })

  it('orders by _created with oldest first', async () => {
    const { findAllByTestId } = render(<Basic {...(Basic.args as IProps)} />)

    const allItems = await findAllByTestId('CategoryHorizonalList-Item')

    expect(allItems[0].title).toEqual('Machines')
    expect(allItems[11].title).toEqual('Guides')
  })

  it('renders default category glyph when specific glyph is missing', async () => {
    const { findAllByTestId } = render(
      <WhenGlyphNotPresent {...(WhenGlyphNotPresent.args as IProps)} />,
    )

    const allItems = await findAllByTestId('category-icon')

    expect(allItems).toHaveLength(3)
  })

  it("doesn't render items when less than three at present", () => {
    const { getByTestId } = render(<OnlyOne {...(OnlyOne.args as IProps)} />)
    expect(() => getByTestId('MemberTypeVerticalList-Item')).toThrow()
  })
})
