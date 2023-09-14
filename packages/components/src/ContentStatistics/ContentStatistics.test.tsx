import { render } from '../tests/utils'
import { Default } from './ContentStatistics.stories'
import type { ContentStatisticsProps } from './ContentStatistics'

describe('ContentStatistics', () => {
  it('validates the component behaviour', () => {
    const { getByTestId } = render(
      <Default {...(Default.args as ContentStatisticsProps)} />,
    )

    expect(false).toBe(true);
  })
})
