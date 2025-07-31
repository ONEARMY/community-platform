import '@testing-library/jest-dom/vitest'

// import { render } from '@testing-library/react'
import { beforeEach, describe, vi } from 'vitest'

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

  // it('renders each member type given', async () => {
  //   // TODO
  //   const { findAllByTestId } = render(<Basic {...Basic.args} />)

  //   expect(await findAllByTestId('MemberTypeVerticalList-Item')).toHaveLength(6)
  // })

  // it("doesn't render items when only one exists", () => {
  //   const { getByTestId } = render(<OnlyOne {...(OnlyOne.args as IProps)} />)
  //   expect(() => getByTestId('MemberTypeVerticalList-Item')).toThrow()
  // })
})
