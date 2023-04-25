import { render } from '../tests/utils'
import { Default } from './UserStatistics.stories'
import type { UserStatisticsProps } from './UserStatistics'

describe('UserStatistics', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Default {...(Default.args as UserStatisticsProps)} />,
    )

    expect(container).toMatchSnapshot()
  })
})
