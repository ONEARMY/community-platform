import { describe, expect, it } from 'vitest'

import { render } from '../tests/utils'
import { Default } from './ContentStatistics.stories'

import type { IProps } from './ContentStatistics'

describe('ContentStatistics', () => {
  it('contains the views, star, comment and update icons', () => {
    const { getAllByAltText } = render(
      <Default {...(Default.args as IProps)} />,
    )

    const expectedIcons = [
      '/assets/icons/icon-views.svg',
      '/assets/icons/icon-star-default.svg',
      '/assets/icons/icon-comment.svg',
      '/assets/icons/icon-update.svg',
    ]

    const icons = getAllByAltText('icon')

    expect(icons.length).toBe(4)

    for (const icon of icons) {
      expect(expectedIcons).toContain(icon.getAttribute('src'))
    }
  })
})
