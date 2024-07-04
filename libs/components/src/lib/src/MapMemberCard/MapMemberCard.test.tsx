import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { MapMemberCard } from './MapMemberCard'
import { Default, ModerationComments } from './MapMemberCard.stories'

describe('MapMemberCard', () => {
  it('includes description if it exists', () => {
    const { getByText, getByTestId } = render(
      <MapMemberCard {...Default.args} />,
    )

    expect(getByText(Default.args.description)).toBeInTheDocument()
    expect(() => getByTestId('MapMemberCard: moderation comments')).toThrow()
  })

  it('shows moderation comments if they exist', () => {
    const { getByText, getByTestId } = render(
      <MapMemberCard {...ModerationComments.args} />,
    )
    expect(
      getByTestId('MapMemberCard: moderation comments'),
    ).toBeInTheDocument()
    expect(getByText(ModerationComments.args.comments)).toBeInTheDocument()
  })
})
