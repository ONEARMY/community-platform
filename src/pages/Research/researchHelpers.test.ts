import { ResearchUpdateStatus, UserRole } from 'oa-shared'
import { describe, expect, it } from 'vitest'

import { researchUpdateStatusFilter } from './researchHelpers'

import type { IResearch, IUserDB } from 'oa-shared'

describe('Research Helpers', () => {
  describe('Research Update Status Filter', () => {
    it('should not show item when deleted', () => {
      // prepare
      const user = { _id: 'author' } as IUserDB
      const item = { _createdBy: user._id } as IResearch.Item
      const update = { _deleted: true } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(false)
    })

    it('should not show item when deleted and draft', () => {
      // prepare
      const user = { _id: 'author' } as IUserDB
      const item = { _createdBy: user._id } as IResearch.Item
      const update = {
        _deleted: true,
        status: ResearchUpdateStatus.DRAFT,
      } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(false)
    })

    it('should not show when draft and not author', () => {
      // prepare
      const user = { _id: 'non-author' } as IUserDB
      const item = { _createdBy: 'author' } as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(false)
    })

    it('should not show when draft and not authenticated', () => {
      // prepare
      const user = { _id: 'author' } as IUserDB
      const item = { _createdBy: user._id } as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update)

      // assert
      expect(show).toEqual(false)
    })

    it('should show when not draft and not deleted', () => {
      // prepare
      const user = { _id: 'author' } as IUserDB
      const item = { _createdBy: user._id } as IResearch.Item
      const update = {
        status: ResearchUpdateStatus.PUBLISHED,
      } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update)

      // assert
      expect(show).toEqual(true)
    })

    it('should show when draft and current user is the author', () => {
      // prepare
      const user = { _id: 'author' } as IUserDB
      const item = { _createdBy: user._id } as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(true)
    })

    it('should show when draft and current user is a collaborator', () => {
      // prepare
      const user = { _id: 'author' } as IUserDB
      const item = { collaborators: [user._id] } as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(true)
    })

    it('should show when draft and current user is an Admin', () => {
      // prepare
      const user = { _id: 'admin', userRoles: [UserRole.ADMIN] } as IUserDB
      const item = {} as IResearch.Item
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearch.Update

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(true)
    })
  })
})
