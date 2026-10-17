import { describe, expect, it } from 'vitest';
import type { DBAdminComment } from './comment';
import { AdminComment } from './comment';

const dbComment: DBAdminComment = {
  id: 7,
  comment: 'Nice work',
  source_type: 'questions',
  source_id: 3,
  parent_id: null,
  created_at: '2026-08-20T10:00:00Z',
  deleted: false,
  username: 'maker',
  display_name: 'Maker One',
  notification_count: 2,
  source_slug: 'how-to-shred',
};

describe('AdminComment.fromDB', () => {
  it.each([
    ['questions', '/questions/how-to-shred#comment:7'],
    ['projects', '/library/how-to-shred#comment:7'],
    ['news', '/news/how-to-shred#comment:7'],
    ['research_updates', '/research/how-to-shred?update_3#comment:7'],
  ] as const)('links %s comments to their live location', (sourceType, liveUrl) => {
    expect(AdminComment.fromDB({ ...dbComment, source_type: sourceType }).liveUrl).toBe(liveUrl);
  });

  it('has no live url when the source is unavailable', () => {
    expect(AdminComment.fromDB({ ...dbComment, source_slug: null }).liveUrl).toBeNull();
  });

  it('has no author when the profile is missing', () => {
    expect(
      AdminComment.fromDB({ ...dbComment, username: null, display_name: null }).author,
    ).toBeNull();
  });
});
