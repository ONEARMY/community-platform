import { cleanup, render } from '@testing-library/react'
import { VerifiedUserBadge } from './VerifiedUserBadge'

jest.mock('src/index', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  useCommonStores() {
    return {
      stores: {
        aggregationsStore: {
          aggregations: { users_verified: { test_verified: true } },
        },
      },
    }
  },
}))

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

it('VerifiedUserBadge renders verified user', () => {
  const { container } = render(<VerifiedUserBadge userId="test_verified" />)

  expect(container.childElementCount).toBeGreaterThan(0)
})

it('VerifiedUserBadge ignores non-verified user', () => {
  const { container } = render(<VerifiedUserBadge userId="test_not_verified" />)

  expect(container.childElementCount).toEqual(0)
})

// Provide export to use in other mocks
export const MockVerifiedUserBadge = () =>
  jest.mock('src/components/VerifiedUserBadge/VerifiedUserBadge', () => ({
    VerifiedUserBadge: () => <div></div>,
  }))
