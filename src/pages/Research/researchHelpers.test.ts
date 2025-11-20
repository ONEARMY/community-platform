import { UserRole } from 'oa-shared';
import { describe, expect, it } from 'vitest';

import { researchUpdateStatusFilter } from './researchHelpers';

import type { Author, DBProfile, ResearchUpdate } from 'oa-shared';

describe('Research Helpers', () => {
  describe('Research Update Status Filter', () => {
    it('should not show item when deleted', () => {
      // prepare
      const user = { id: 1 } as DBProfile;
      const update = { deleted: true } as ResearchUpdate;

      // act
      const show = researchUpdateStatusFilter(null, null, update, user);

      // assert
      expect(show).toEqual(false);
    });

    it('should not show item when deleted and draft', () => {
      // prepare
      const user = { id: 1 } as DBProfile;
      const update = {
        deleted: true,
        isDraft: true,
      } as ResearchUpdate;

      // act
      const show = researchUpdateStatusFilter(null, null, update, user);

      // assert
      expect(show).toEqual(false);
    });

    it('should not show when draft and not author', () => {
      // prepare
      const user = { id: 1 } as DBProfile;
      const author = { id: 2 } as Author;
      const update = { isDraft: true } as ResearchUpdate;

      // act
      const show = researchUpdateStatusFilter(author, null, update, user);

      // assert
      expect(show).toEqual(false);
    });

    it('should not show when draft and not authenticated', () => {
      // prepare
      const update = { isDraft: true } as ResearchUpdate;

      // act
      const show = researchUpdateStatusFilter(null, null, update, undefined);

      // assert
      expect(show).toEqual(false);
    });

    it('should show when not draft and not deleted', () => {
      // prepare
      const update = {
        isDraft: false,
      } as ResearchUpdate;

      // act
      const show = researchUpdateStatusFilter(null, null, update, undefined);

      // assert
      expect(show).toEqual(true);
    });

    it('should show when draft and current user is the author', () => {
      // prepare
      const author = { id: 1 } as Author;
      const user = { id: 1 } as DBProfile;
      const update = { isDraft: true } as ResearchUpdate;

      // act
      const show = researchUpdateStatusFilter(author, null, update, user);

      // assert
      expect(show).toEqual(true);
    });

    it('should show when draft and current user is a collaborator', () => {
      // prepare
      const collaborators = [{ id: 1 }] as Author[];
      const user = { id: 1 } as DBProfile;
      const update = { isDraft: true } as ResearchUpdate;

      // act
      const show = researchUpdateStatusFilter(null, collaborators, update, user);

      // assert
      expect(show).toEqual(true);
    });

    it('should show when draft and current user is an Admin', () => {
      // prepare
      const user = { id: 1, roles: [UserRole.ADMIN] } as DBProfile;
      const update = { isDraft: true } as ResearchUpdate;

      // act
      const show = researchUpdateStatusFilter(null, null, update, user);

      // assert
      expect(show).toEqual(true);
    });
  });
});
