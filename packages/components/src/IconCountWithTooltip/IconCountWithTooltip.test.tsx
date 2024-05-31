import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './IconCountWithTooltip.stories'

import type { IconCountWithTooltipProps } from './IconCountWithTooltip'

describe('IconCountWithTooltip', () => {
  it('validates the component behaviour', () => {
    const { getByRole } = render(
      <Default {...(Default.args as IconCountWithTooltipProps)} />,
    )

    const img = getByRole('img')

    expect(img).toHaveAttribute('src', '/assets/icons/icon-comment.svg')
  })
})
