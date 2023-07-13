import { render } from '../tests/utils'
import { Default } from './UserStatistics.stories'
import type { UserStatisticsProps } from './UserStatistics'

describe('UserStatistics', () => {
  it('renders correctly', () => {
    render(<Default {...(Default.args as UserStatisticsProps)} />)
  })

  it('renders verified icon when isVerified is true', () => {
    const { getByTestId } = render(
      <Default {...(Default.args as UserStatisticsProps)} />,
    )
    const verifiedIcon = getByTestId('verified-stat')

    expect(verifiedIcon).toBeInTheDocument()
  })

  it('renders location link when country and userName are provided', () => {
    const { getByTestId } = render(
      <Default {...(Default.args as UserStatisticsProps)} />,
    )
    const locationLink = getByTestId('location-link')

    expect(locationLink).toHaveTextContent('Greenland')
  })

  it('renders supporter icon when isSupporter is true', () => {
    const { getByTestId } = render(
      <Default {...(Default.args as UserStatisticsProps)} />,
    )
    const supporterLink = getByTestId('supporter-stat')

    expect(supporterLink).toBeInTheDocument()
  })

  it('renders useful count when usefulCount is provided', () => {
    const { getByTestId } = render(
      <Default {...(Default.args as UserStatisticsProps)} />,
    )
    const usefulCount = getByTestId('useful-stat')

    expect(usefulCount).toHaveTextContent('Useful: 20')
  })

  it('renders howto count when howtoCount is provided', () => {
    const { getByTestId } = render(
      <Default {...(Default.args as UserStatisticsProps)} />,
    )
    const howtoCount = getByTestId('howto-stat')

    expect(howtoCount).toHaveTextContent(/^How[-‑]?to: 10$/)
  })

  it('renders research count when researchCount is provided', () => {
    const { getByTestId } = render(
      <Default {...(Default.args as UserStatisticsProps)} />,
    )
    const researchCount = getByTestId('research-stat')

    expect(researchCount).toHaveTextContent(/^Research: 2$/)
  })
})
