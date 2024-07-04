import { ResearchUpdateStatus, UserRole } from '@onearmy.apps/shared'
import { describe, expect, it } from 'vitest'

import { researchUpdateStatusFilter } from './researchHelpers'

import type { IResearchItem, IResearchUpdate, IUserPPDB } from '../../models'

describe('Research Helpers', () => {
  describe('Research Update Status Filter', () => {
    it('should not show item when deleted', () => {
      // prepare
      const user = { _id: 'author' } as IUserPPDB
      const item = { _createdBy: user._id } as IResearchItem
      const update = { _deleted: true } as IResearchUpdate

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(false)
    })

    it('should not show item when deleted and draft', () => {
      // prepare
      const user = { _id: 'author' } as IUserPPDB
      const item = { _createdBy: user._id } as IResearchItem
      const update = {
        _deleted: true,
        status: ResearchUpdateStatus.DRAFT,
      } as IResearchUpdate

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(false)
    })

    it('should not show when draft and not author', () => {
      // prepare
      const user = { _id: 'non-author' } as IUserPPDB
      const item = { _createdBy: 'author' } as IResearchItem
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearchUpdate

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(false)
    })

    it('should not show when draft and not authenticated', () => {
      // prepare
      const user = { _id: 'author' } as IUserPPDB
      const item = { _createdBy: user._id } as IResearchItem
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearchUpdate

      // act
      const show = researchUpdateStatusFilter(item, update)

      // assert
      expect(show).toEqual(false)
    })

    it('should show when not draft and not deleted', () => {
      // prepare
      const user = { _id: 'author' } as IUserPPDB
      const item = { _createdBy: user._id } as IResearchItem
      const update = {
        status: ResearchUpdateStatus.PUBLISHED,
      } as IResearchUpdate

      // act
      const show = researchUpdateStatusFilter(item, update)

      // assert
      expect(show).toEqual(true)
    })

    it('should show when draft and current user is the author', () => {
      // prepare
      const user = { _id: 'author' } as IUserPPDB
      const item = { _createdBy: user._id } as IResearchItem
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearchUpdate

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(true)
    })

    it('should show when draft and current user is a collaborator', () => {
      // prepare
      const user = { _id: 'author' } as IUserPPDB
      const item = { collaborators: [user._id] } as IResearchItem
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearchUpdate

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(true)
    })

    it('should show when draft and current user is an Admin', () => {
      // prepare
      const user = { _id: 'admin', userRoles: [UserRole.ADMIN] } as IUserPPDB
      const item = {} as IResearchItem
      const update = { status: ResearchUpdateStatus.DRAFT } as IResearchUpdate

      // act
      const show = researchUpdateStatusFilter(item, update, user)

      // assert
      expect(show).toEqual(true)
    })
  })
})
