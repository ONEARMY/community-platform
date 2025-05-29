import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { MemberHistory } from './MemberHistory'

import type { MemberHistoryProps } from './MemberHistory'

describe('MemberHistory', () => {
  it('renders member since and last active', () => {
    const props: MemberHistoryProps = {
      memberSince: '2020-01-01',
      lastActive: '2023-01-01',
    }
    const { getByText } = render(<MemberHistory {...props} />)
    expect(getByText('Member since 2020')).toBeInTheDocument()
    expect(getByText('Last active over 2 years ago')).toBeInTheDocument()
  })
})
