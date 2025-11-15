import '@testing-library/jest-dom/vitest'

import { subMonths } from 'date-fns'
import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { DisplayDate } from './DisplayDate'

describe('DisplayDate', () => {
  it('renders correctly current date', () => {
    const { getByText } = render(<DisplayDate createdAt={new Date()} />)

    expect(
      getByText('less than a minute ago', { exact: false }),
    ).toBeInTheDocument()
  })

  it('renders correctly when two months ago', () => {
    const twoMonthsAGo = subMonths(new Date(), 2)
    const { getByText } = render(
      <DisplayDate createdAt={twoMonthsAGo}></DisplayDate>,
    )

    expect(getByText('2 months ago', { exact: false })).toBeInTheDocument()
  })
})
