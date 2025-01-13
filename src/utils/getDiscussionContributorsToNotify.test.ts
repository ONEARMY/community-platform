import {
  FactoryDiscussion,
  FactoryDiscussionComment,
} from 'src/test/factories/Discussion'
import { FactoryResearchItem } from 'src/test/factories/ResearchItem'
import { describe, expect, it } from 'vitest'

import { getDiscussionContributorsToNotify } from './getDiscussionContributorsToNotify'

describe('getDiscussionContributorsToNotify', () => {
  it('adds research update collaborators not already included', () => {
    const contributorIds = ['1', '2', '3', '4']
    const discussion = FactoryDiscussion({ contributorIds })
    const comment = FactoryDiscussionComment()
    const parentContent = FactoryResearchItem()
    const bonusIds = ['1', 'new-id']

    const toNotify = getDiscussionContributorsToNotify(
      discussion,
      parentContent,
      comment,
      bonusIds,
    )
    const expectation = [parentContent._createdBy, ...contributorIds, 'new-id']

    expect(toNotify).toEqual(expectation)
  })
})
