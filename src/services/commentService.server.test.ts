import type { DBAdminComment } from 'oa-shared';
import { CommentServiceServer } from 'src/services/commentService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.fn();
const mockClient: any = { rpc };

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
  total_count: 41,
};

const getComment = async (overrides: Partial<DBAdminComment> = {}) => {
  rpc.mockResolvedValue({ data: [{ ...dbComment, ...overrides }], error: null });
  const { comments } = await new CommentServiceServer(mockClient).getAdminPage(1, 20);
  return comments[0];
};

describe('CommentServiceServer.getAdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests the page and returns the total count', async () => {
    rpc.mockResolvedValue({ data: [dbComment], error: null });

    const { totalCount } = await new CommentServiceServer(mockClient).getAdminPage(3, 20);

    expect(rpc).toHaveBeenCalledWith('get_admin_comments', { p_limit: 20, p_offset: 40 });
    expect(totalCount).toBe(41);
  });

  it('returns no comments and a zero total for an empty page', async () => {
    rpc.mockResolvedValue({ data: [], error: null });

    expect(await new CommentServiceServer(mockClient).getAdminPage(1, 20)).toEqual({
      comments: [],
      totalCount: 0,
    });
  });

  it.each([
    ['questions', '/questions/how-to-shred#comment:7'],
    ['projects', '/library/how-to-shred#comment:7'],
    ['news', '/news/how-to-shred#comment:7'],
    ['research_updates', '/research/how-to-shred?update_3#comment:7'],
  ] as const)('links %s comments to their live location', async (sourceType, liveUrl) => {
    expect((await getComment({ source_type: sourceType })).liveUrl).toBe(liveUrl);
  });

  it('has no live url when the source is unavailable', async () => {
    expect((await getComment({ source_slug: null })).liveUrl).toBeNull();
  });

  it('has no author when the profile is missing', async () => {
    expect((await getComment({ username: null, display_name: null })).author).toBeNull();
  });

  it('throws on error', async () => {
    rpc.mockResolvedValue({ data: null, error: new Error('boom') });

    await expect(new CommentServiceServer(mockClient).getAdminPage(1, 20)).rejects.toThrow('boom');
  });
});
