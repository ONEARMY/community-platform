import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './ContentStatistics.stories'

import type { IProps } from './ContentStatistics'

describe('ContentStatistics', () => {
  it('contains the views, star, comment and update icons', () => {
    const { getAllByAltText } = render(
      <Default {...(Default.args as IProps)} />,
    )

    const expectedIcons = [
      '/src/lib/assets/icons/icon-views.svg',
      '/src/lib/assets/icons/icon-star-default.svg',
      '/src/lib/assets/icons/icon-comment.svg',
      '/src/lib/assets/icons/icon-update.svg',
    ]

    const icons = getAllByAltText('icon')

    expect(icons.length).toBe(4)

    for (const icon of icons) {
      expect(expectedIcons).toContain(icon.getAttribute('src'))
    }
  })
})
