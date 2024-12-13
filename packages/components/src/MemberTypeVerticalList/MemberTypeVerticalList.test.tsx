import '@testing-library/jest-dom/vitest'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import {
  availableFilters,
  Basic,
  OnlyOne,
} from './MemberTypeVerticalList.stories'

import type { IProps } from './MemberTypeVerticalList.client'

describe('MemberTypeVerticalList', () => {
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

    expect(await findAllByTestId('MemberTypeVerticalList-Item')).toHaveLength(
      availableFilters.length,
    )
  })

  it("doesn't render items only one exists", () => {
    const { getByTestId } = render(<OnlyOne {...(OnlyOne.args as IProps)} />)
    expect(() => getByTestId('MemberTypeVerticalList-Item')).toThrow()
  })
})
