import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import {
  Default,
  LargeCount,
  VeryLargeCount,
} from './IconCountWithTooltip.stories'

import type { IconCountWithTooltipProps } from './IconCountWithTooltip'

describe('IconCountWithTooltip', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as IconCountWithTooltipProps)} />,
    )

    expect(getByText('345')).toBeInTheDocument()
  })

  it('displays the correct count format', () => {
    const { getByText, rerender } = render(
      <LargeCount {...(LargeCount.args as IconCountWithTooltipProps)} />,
    )

    expect(getByText('1.5K')).toBeInTheDocument()

    rerender(
      <VeryLargeCount
        {...(VeryLargeCount.args as IconCountWithTooltipProps)}
      />,
    )

    expect(getByText('2.1M')).toBeInTheDocument()
  })
})
