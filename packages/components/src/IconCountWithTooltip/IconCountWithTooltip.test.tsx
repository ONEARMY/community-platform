import { render } from '../tests/utils'
import { Default } from './IconCountWithTooltip.stories'
import type { IconCountWithTooltipProps } from './IconCountWithTooltip'

describe('IconCountWithTooltip', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as IconCountWithTooltipProps)} />,
    )

    expect(getByText('IconCountWithTooltip')).toBeInTheDocument()
  })
})
