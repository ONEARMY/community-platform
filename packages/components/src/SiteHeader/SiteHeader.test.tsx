import { render } from '../tests/utils'
import { Default } from './SiteHeader.stories'
import type { SiteHeaderProps } from './SiteHeader'

describe('SiteHeader', () => {
  it('validates the component behaviour', () => {
    const { getByTestId } = render(
      <Default {...(Default.args as SiteHeaderProps)} />,
    )

    expect(false).toBe(true)
  })
})
