import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { MemberHistory } from './MemberHistory'

import type { IProps } from './MemberHistory'

describe('MemberHistory', () => {
  it('renders member since and last active', () => {
    const props: IProps = {
      memberSince: new Date(2020, 0, 1),
      lastActive: new Date(2023, 0, 1),
    }
    const { getByText } = render(<MemberHistory {...props} />)
    expect(getByText('Member since 2020')).toBeInTheDocument()
    expect(getByText('Last active over 2 years ago')).toBeInTheDocument()
  })

  it('renders only since details if given weird last active data', () => {
    const props: IProps = {
      memberSince: new Date(2020, 0, 1),
      lastActive: new Date(2020, 0, 1),
    }
    const { getByText, queryAllByText } = render(<MemberHistory {...props} />)
    expect(getByText('Member since 2020')).toBeInTheDocument()
    expect(queryAllByText('Last active over 2 years ago')).toEqual([])
  })
})
