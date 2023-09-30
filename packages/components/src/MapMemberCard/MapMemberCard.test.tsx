import { render } from '../tests/utils'

import { Default, ModerationComments } from './MapMemberCard.stories'
import { MapMemberCard } from './MapMemberCard'

describe('MapMemberCard', () => {
  it('includes description if it exists', () => {
    const { getByText, getByTestId } = render(
      <MapMemberCard {...Default.args} />,
    )

    expect(getByText(Default.args.description)).toBeInTheDocument()
    expect(() => getByTestId('MapMemberCard: moderation comments')).toThrow()
  })

  it('shows moderation comments if they exist', async () => {
    const { getByText, getByTestId } = render(
      <MapMemberCard {...ModerationComments.args} />,
    )
    expect(
      getByTestId('MapMemberCard: moderation comments'),
    ).toBeInTheDocument()
    expect(getByText(ModerationComments.args.comments)).toBeInTheDocument()
  })
})
