import { createClient } from '@supabase/supabase-js';
import type { Database, DBAdminComment } from 'oa-shared';
import { describe, expect, it, vi } from 'vitest';
import { CommentServiceServer } from './commentService.server';

const row = {
  id: 41,
  comment: 'Nice build',
  source_type: 'projects',
  source_id: 7,
  parent_id: null,
  created_at: '2026-08-20T10:00:00Z',
  deleted: null,
  profile: { username: 'maker', display_name: 'Maker One' },
  notification_count: 1201,
  live_url: '/library/build#comment:41',
} satisfies DBAdminComment & { notification_count: number; live_url: string | null };

let clientNumber = 0;
const buildClient = ({
  response = { comments: [row], page: 1, total_pages: 1 } as {
    comments: (DBAdminComment & { notification_count: number; live_url: string | null })[];
    page: number;
    total_pages: number;
  },
  failure = false,
  rpcRows = [] as object[],
  rpcExtra = [] as { id: number; parent_id?: number | null }[],
} = {}) => {
  const requests: { url: URL; method: string; body: unknown }[] = [];
  const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    requests.push({
      url,
      method: init?.method ?? 'GET',
      body: init?.body ? JSON.parse(String(init.body)) : null,
    });
    if (failure) {
      return Response.json({ message: 'query failed' }, { status: 500 });
    }
    if (url.pathname.endsWith('/get_admin_comments')) {
      return Response.json(response);
    }
    const id = url.searchParams.get('id');
    return Response.json(
      id ? rpcExtra.filter((r) => r.id === Number(id.replace('eq.', ''))) : rpcRows,
    );
  });
  const client = createClient<Database>('https://example.test', 'public-test-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storageKey: `comment-review-${++clientNumber}`,
    },
    global: { fetch },
  });
  return { client, requests };
};

describe('CommentServiceServer.getAdminPage', () => {
  it.each([
    ['2026-09-05T23:30:00Z', /^5 Sept? 2026$/],
    ['2026-01-01T00:30:00Z', /^1 Jan 2026$/],
    ['2011-12-30T12:00:00Z', /^30 Dec 2011$/],
    ['2024-02-29T23:59:59Z', /^29 Feb 2024$/],
  ])('serializes the UTC date label for %s before rendering', async (created_at, label) => {
    const { client } = buildClient({
      response: { comments: [{ ...row, created_at }], page: 1, total_pages: 1 },
    });
    const result = await new CommentServiceServer(client).getAdminPage(1);

    expect(JSON.parse(JSON.stringify(result)).comments[0].createdAtLabel).toMatch(label);
  });

  it('loads comments, links and counts in one paginated RPC', async () => {
    const { client, requests } = buildClient();
    const result = await new CommentServiceServer(client).getAdminPage(1);
    expect(result.comments[0]).toMatchObject({
      notificationCount: 1201,
      liveUrl: '/library/build#comment:41',
      sourceId: 7,
      deleted: false,
      author: { displayName: 'Maker One' },
    });
    expect(result.comments[0].createdAtLabel).toBe('20 Aug 2026');
    expect(requests).toHaveLength(1);
    expect(requests[0].url.pathname).toBe('/rest/v1/rpc/get_admin_comments');
    expect(requests[0].body).toEqual({ p_page: 1, p_page_size: 20 });
  });

  it('uses the clamped page returned by the database without retrying', async () => {
    const { client, requests } = buildClient({
      response: { comments: [row], page: 3, total_pages: 3 },
    });
    expect(await new CommentServiceServer(client).getAdminPage(999)).toMatchObject({
      page: 3,
      totalPages: 3,
    });
    expect(requests).toHaveLength(1);
    expect(requests[0].body).toEqual({ p_page: 999, p_page_size: 20 });
  });

  it('returns the empty first page', async () => {
    const { client, requests } = buildClient({
      response: { comments: [], page: 1, total_pages: 1 },
    });
    expect(await new CommentServiceServer(client).getAdminPage(3)).toEqual({
      comments: [],
      page: 1,
      totalPages: 1,
    });
    expect(requests).toHaveLength(1);
  });

  it('preserves full text when a comment has no live destination or creator', async () => {
    const { client } = buildClient({
      response: {
        comments: [{ ...row, live_url: null, profile: null, deleted: true }],
        page: 1,
        total_pages: 1,
      },
    });
    expect((await new CommentServiceServer(client).getAdminPage(1)).comments[0]).toMatchObject({
      liveUrl: null,
      comment: row.comment,
      author: null,
      deleted: true,
    });
  });

  it('propagates database errors', async () => {
    const { client } = buildClient({ failure: true });
    await expect(new CommentServiceServer(client).getAdminPage(1)).rejects.toMatchObject({
      message: 'query failed',
    });
  });
});

describe('CommentServiceServer.getDiscussionComments', () => {
  it('adds a capped-out reply and its parent through the same source-scoped RPC', async () => {
    const { client, requests } = buildClient({
      rpcRows: [{ id: 1 }],
      rpcExtra: [
        { id: 1002, parent_id: 1001 },
        { id: 1001, parent_id: null },
      ],
    });
    const comments = await new CommentServiceServer(client).getDiscussionComments(
      'projects',
      '7',
      null,
      1002,
    );
    expect(comments.map((c) => c.id)).toEqual([1, 1002, 1001]);
    expect(requests).toHaveLength(3);
    for (const request of requests) {
      expect(request.url.pathname).toContain('/rpc/get_comments_with_votes');
    }
  });

  it('does not fetch an extra row when the highlighted thread is already returned', async () => {
    const { client, requests } = buildClient({ rpcRows: [{ id: 41, parent_id: null }] });
    await new CommentServiceServer(client).getDiscussionComments('projects', '7', null, 41);
    expect(requests).toHaveLength(1);
  });
});
