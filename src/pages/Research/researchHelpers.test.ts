import { ResearchUpdateStatus } from 'oa-shared'
import { describe, expect, it } from 'vitest'

import { researchUpdateStatusFilter } from './researchHelpers'

import type { IResearch } from 'src/models'

describe('Research Helpers', () => {
  describe('Research Update Status Filter', () => {
    it('should not show item when deleted', async () => {
      // prepare
      const authorId = 'author'
      const item = { _createdBy: authorId } as IResearch.Item
      const update = { _deleted: true } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, authorId)

      // assert
      expect(show).toEqual(false)
    })

    it('should not show item when deleted and draft', async () => {
      // prepare
      const authorId = 'author'
      const item = { _createdBy: authorId } as IResearch.Item
      const update = {
        _deleted: true,
        status: ResearchUpdateStatus.DRAFT,
      } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, authorId)

      // assert
      expect(show).toEqual(false)
    })

    it('should not show when draft and not author', async () => {
      // prepare
      const authorId = 'author'
      const item = { _createdBy: authorId } as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, 'not-author')

      // assert
      expect(show).toEqual(false)
    })

    it('should not show when draft and not authenticated', async () => {
      // prepare
      const authorId = 'author'
      const item = { _createdBy: authorId } as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update)

      // assert
      expect(show).toEqual(false)
    })

    it('should show when not draft and not deleted', async () => {
      // prepare
      const authorId = 'author'
      const item = { _createdBy: authorId } as IResearch.Item
      const update = {
        status: ResearchUpdateStatus.PUBLISHED,
      } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update)

      // assert
      expect(show).toEqual(true)
    })

    it('should show when draft and current user is the author', async () => {
      // prepare
      const authorId = 'author'
      const item = { _createdBy: authorId } as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, authorId)

      // assert
      expect(show).toEqual(true)
    })

    it('should show when draft and current user is a collaborator', async () => {
      // prepare
      const authorId = 'author'
      const item = { collaborators: [authorId] } as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, authorId)

      // assert
      expect(show).toEqual(true)
    })
  })
})
