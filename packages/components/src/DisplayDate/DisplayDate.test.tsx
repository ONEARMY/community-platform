import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default, TwoMonthsAGo } from './DisplayDate.stories'

import type { IProps } from './DisplayDate'

describe('DisplayDate', () => {
  it('renders correctly current date', () => {
    const { getByText } = render(<Default {...(TwoMonthsAGo.args as IProps)} />)

    expect(getByText('less than a minute ago')).toBeInTheDocument()
  })

  it('renders correctly when two months ago', () => {
    const { getByText } = render(
      <TwoMonthsAGo {...(TwoMonthsAGo.args as IProps)} />,
    )

    expect(getByText('about 2 months ago')).toBeInTheDocument()
  })
})
