import '@testing-library/jest-dom/vitest'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import {
  Basic,
  OnlyOne,
  WhenGlyphNotPresent,
} from './CategoryVerticalList.stories'

import type { IProps } from './CategoryVerticalList'

describe('CategoryVerticalList', () => {
  // https://stackoverflow.com/a/62148101
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver
  })

  it('renders each member type given', async () => {
    const { findAllByTestId } = render(<Basic {...(Basic.args as IProps)} />)

    expect(await findAllByTestId('CategoryVerticalList-Item')).toHaveLength(10)
  })

  it('renders default category glyph when specific glyph is missing', async () => {
    const { findAllByTestId } = render(
      <WhenGlyphNotPresent {...(WhenGlyphNotPresent.args as IProps)} />,
    )

    expect(await findAllByTestId('category-icon')).toHaveLength(2)
  })

  it("doesn't render items when only one exists", () => {
    const { getByTestId } = render(<OnlyOne {...(OnlyOne.args as IProps)} />)
    expect(() => getByTestId('MemberTypeVerticalList-Item')).toThrow()
  })
})
