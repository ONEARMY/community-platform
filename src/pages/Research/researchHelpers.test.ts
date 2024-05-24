import { ResearchUpdateStatus } from 'oa-shared'
import { FactoryResearchItemUpdate } from 'src/test/factories/ResearchItem'

import {
  getResearchTotalCommentCount,
  researchUpdateStatusFilter,
} from './researchHelpers'

import type { IResearch } from 'src/models'

describe('Research Helpers', () => {
  describe('getResearchTotalCommentCount Function', () => {
    it('should return 0 when item has no updates', () => {
      const item = { item: {} } as any
      expect(getResearchTotalCommentCount(item)).toBe(0)
    })

    it('should return 0 when updates have no comments', () => {
      const item = {
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: ResearchUpdateStatus.PUBLISHED,
            _deleted: false,
          }),
        ),
      } as IResearch.ItemDB
      expect(getResearchTotalCommentCount(item)).toBe(0)
    })

    it('should use totalCommentCount if present', () => {
      const item = {
        totalCommentCount: 5,
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: ResearchUpdateStatus.PUBLISHED,
            _deleted: false,
          }),
        ),
      } as IResearch.ItemDB
      expect(getResearchTotalCommentCount(item)).toBe(5)
    })

    it('should use totalCommentCount when 0', () => {
      const item = {
        totalCommentCount: 0,
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: ResearchUpdateStatus.PUBLISHED,
            _deleted: false,
          }),
        ),
      } as IResearch.ItemDB
      expect(getResearchTotalCommentCount(item)).toBe(0)
    })

    it('should return the correct amount of comments', () => {
      const item = {
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: ResearchUpdateStatus.PUBLISHED,
            _deleted: false,
            comments: Array.from({ length: 3 }),
          }),
        ),
      } as IResearch.ItemDB
      expect(getResearchTotalCommentCount(item)).toBe(9)
    })

    it('should ignore deleted and draft updates', () => {
      const item = {
        updates: Array.from({ length: 2 })
          .fill(
            FactoryResearchItemUpdate({
              status: ResearchUpdateStatus.PUBLISHED,
              _deleted: false,
              comments: Array.from({ length: 2 }),
            }),
          )
          .concat([
            FactoryResearchItemUpdate({
              status: ResearchUpdateStatus.PUBLISHED,
              _deleted: true,
              comments: Array.from({ length: 3 }),
            }),
            FactoryResearchItemUpdate({
              status: ResearchUpdateStatus.DRAFT,
              _deleted: false,
              comments: Array.from({ length: 6 }),
            }),
          ]),
      } as IResearch.ItemDB
      expect(getResearchTotalCommentCount(item)).toBe(4)
    })
  })

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
