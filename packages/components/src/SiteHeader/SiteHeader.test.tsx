import { render } from '../tests/utils'
import { Default } from './SiteHeader.stories'
import type { SiteHeaderProps } from './SiteHeader'

describe('SiteHeader', () => {
  it('renders the log in link', () => {
    const { getByText } = render(
      <Default {...(Default.args as SiteHeaderProps)} />,
    )

    expect(getByText('log in')).toBe(true)
  })
})
