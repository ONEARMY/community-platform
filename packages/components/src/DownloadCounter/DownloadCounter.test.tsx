import '@testing-library/jest-dom'

import { describe, expect, it } from 'vitest'

import { render } from '../tests/utils'
import { Default, One, Zero } from './DownloadCounter.stories'

import type { IProps } from './DownloadCounter'

describe('DownloadCounter', () => {
  it('Adds commas for larger download counts', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('1,888,999 downloads')).toBeInTheDocument()
  })

  it('Adds "download" when total is one', () => {
    const { getByText } = render(<One {...(One.args as IProps)} />)

    expect(getByText('1 download')).toBeInTheDocument()
  })

  it('Adds a zero for undefined total', () => {
    const { getByText } = render(<Zero {...(Zero.args as IProps)} />)

    expect(getByText('0 downloads')).toBeInTheDocument()
  })
})
