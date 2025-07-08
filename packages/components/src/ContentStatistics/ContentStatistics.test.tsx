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
      '/assets/icons/eye.svg',
      '/assets/icons/icon-star-default.svg',
      '/assets/icons/icon-comment.svg',
      '/assets/icons/icon-update.svg',
      '/assets/icons/chevron-down.svg',
    ]

    const icons = getAllByAltText('icon')

    expect(icons.length).toBe(5)

    for (const icon of icons) {
      expect(expectedIcons).toContain(icon.getAttribute('src'))
    }
  })
})
