import { ResearchUpdateStatus } from 'oa-shared'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from 'src/test/factories/ResearchItem'
import { describe, expect, it } from 'vitest'

import { liveResearchUpdatesCommentCounts } from './discussionEvents'

describe('liveResearchUpdatesCommentCounts', () => {
  describe('No updates', () => {
    it('returns zero', () => {
      const research = FactoryResearchItem({ updates: [] })
      expect(liveResearchUpdatesCommentCounts(research.updates)).toEqual(0)
    })
  })

  describe('_deleted', () => {
    it('ignores deleted updates', () => {
      const deletedUpdate = FactoryResearchItemUpdate({
        _deleted: true,
        commentCount: 2,
      })
      const liveUpdate = FactoryResearchItemUpdate({
        _deleted: false,
        status: ResearchUpdateStatus.PUBLISHED,
        commentCount: 3,
      })
      const research = FactoryResearchItem({
        updates: [deletedUpdate, liveUpdate, liveUpdate],
      })

      expect(liveResearchUpdatesCommentCounts(research.updates)).toEqual(6)
    })
  })

  describe('drafts', () => {
    it('ignores draft updates', () => {
      const draftUpdate = FactoryResearchItemUpdate({
        status: ResearchUpdateStatus.DRAFT,
        commentCount: 4,
      })
      const liveUpdate = FactoryResearchItemUpdate({
        _deleted: false,
        status: ResearchUpdateStatus.PUBLISHED,
        commentCount: 5,
      })
      const commentlessLiveUpdate = FactoryResearchItemUpdate({
        _deleted: false,
        status: ResearchUpdateStatus.PUBLISHED,
      })
      const research = FactoryResearchItem({
        updates: [liveUpdate, draftUpdate, commentlessLiveUpdate],
      })

      expect(liveResearchUpdatesCommentCounts(research.updates)).toEqual(5)
    })
  })
})
