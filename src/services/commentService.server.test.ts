import { createClient } from '@supabase/supabase-js';
import type { DiscussionContentType } from 'oa-shared';
import { describe, expect, it, vi } from 'vitest';
import { CommentServiceServer } from './commentService.server';

type Row = {
  id: number;
  comment: string;
  source_type: DiscussionContentType;
  source_id: number | null;
  parent_id: number | null;
  created_at: string;
  deleted: boolean | null;
  profile: { username: string | null; display_name: string } | null;
};
const row: Row = {
  id: 41,
  comment: 'Nice build',
  source_type: 'projects',
  source_id: 7,
  parent_id: null,
  created_at: '2026-08-20T10:00:00Z',
  deleted: null,
  profile: { username: 'maker', display_name: 'Maker One' },
};
let clientNumber = 0;
const buildClient = ({
  rows = [row],
  totals = [rows.length],
  pages = [rows],
  notifications = [{ content_type: 'comments', content_id: 41 }],
  sources = { projects: [{ id: 7, slug: 'build', deleted: false }] } as Record<string, object[]>,
  parents = [] as object[],
  failure = '',
  rpcRows = [] as object[],
  rpcExtra = [] as { id: number; parent_id?: number | null }[],
} = {}) => {
  let countIndex = 0;
  let pageIndex = 0;
  const requests: { url: URL; method: string }[] = [];
  const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const method = init?.method ?? 'GET';
    requests.push({ url, method });
    const table = url.pathname.split('/').at(-1)!;
    if (`${table}:${method}` === failure) {
      return Response.json({ message: 'query failed' }, { status: 500 });
    }
    if (method === 'HEAD') {
      const types = url.searchParams.get('content_type') ?? '';
      const id = Number(url.searchParams.get('content_id')?.replace('eq.', ''));
      const count =
        table === 'comments'
          ? totals[Math.min(countIndex++, totals.length - 1)]
          : notifications.filter((n) => types.includes(n.content_type) && n.content_id === id)
              .length;
      return new Response(null, { headers: { 'content-range': `*/${count}` } });
    }
    let data: object[];
    if (table === 'get_comments_with_votes') {
      const id = url.searchParams.get('id');
      data = id ? rpcExtra.filter((r) => r.id === Number(id.replace('eq.', ''))) : rpcRows;
    } else if (table === 'comments') {
      data = url.searchParams.has('id') ? parents : pages[Math.min(pageIndex++, pages.length - 1)];
    } else {
      data = sources[table] ?? [];
    }
    return Response.json(data);
  });
  const client = createClient('https://example.test', 'public-test-key', {
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
  it('counts current and historical notifications for the right comment without fetching notification rows', async () => {
    const { client, requests } = buildClient({
      notifications: [
        { content_type: 'comments', content_id: 41 },
        { content_type: 'comment', content_id: 41 },
        { content_type: 'reply', content_id: 41 },
        { content_type: 'projects', content_id: 41 },
        { content_type: 'comments', content_id: 42 },
      ],
    });
    const result = await new CommentServiceServer(client).getAdminPage(1);
    expect(result.comments[0]).toMatchObject({
      notificationCount: 3,
      liveUrl: '/library/build#comment:41',
      sourceId: 7,
      deleted: false,
      author: { displayName: 'Maker One' },
    });
    expect(result.comments[0].createdAt).toEqual(new Date(row.created_at));
    expect(
      requests.filter((r) => r.url.pathname.endsWith('/notifications')).map((r) => r.method),
    ).toEqual(['HEAD']);
  });

  it('counts above the PostgREST response row limit', async () => {
    const { client } = buildClient({
      notifications: Array.from({ length: 1201 }, () => ({
        content_type: 'comments',
        content_id: 41,
      })),
    });
    expect(
      (await new CommentServiceServer(client).getAdminPage(1)).comments[0].notificationCount,
    ).toBe(1201);
  });

  it('clamps the range and uses deterministic date/id ordering', async () => {
    const { client, requests } = buildClient({ totals: [45] });
    const result = await new CommentServiceServer(client).getAdminPage(999);
    expect(result).toMatchObject({ page: 3, totalPages: 3 });
    const query = requests.find((r) => r.url.searchParams.has('offset'))!.url.searchParams;
    expect(query.get('offset')).toBe('40');
    expect(query.get('limit')).toBe('20');
    expect(query.get('order')).toBe('created_at.desc,id.desc');
  });

  it('recounts and returns the preceding page when the last page disappears', async () => {
    const { client, requests } = buildClient({ totals: [21, 20], pages: [[], [row]] });
    const result = await new CommentServiceServer(client).getAdminPage(2);
    expect(result).toMatchObject({ page: 1, totalPages: 1 });
    expect(result.comments).toHaveLength(1);
    expect(
      requests
        .filter((r) => r.url.searchParams.has('offset'))
        .map((r) => r.url.searchParams.get('offset')),
    ).toEqual(['20', '0']);
  });

  it('skips row/source/notification queries on an empty database', async () => {
    const { client, requests } = buildClient({ rows: [] });
    expect(await new CommentServiceServer(client).getAdminPage(3)).toEqual({
      comments: [],
      page: 1,
      totalPages: 1,
    });
    expect(requests).toHaveLength(1);
  });

  it.each([
    'comments:HEAD',
    'comments:GET',
    'notifications:HEAD',
    'projects:GET',
  ])('propagates %s failures', async (failure) => {
    const { client } = buildClient({ failure });
    await expect(new CommentServiceServer(client).getAdminPage(1)).rejects.toMatchObject({
      message: 'query failed',
    });
  });

  it.each([
    { ...row, deleted: true },
    { ...row, source_id: null },
  ])('keeps unavailable comment text without a dead link', async (comment) => {
    const { client } = buildClient({ rows: [{ ...comment, profile: null }] });
    expect((await new CommentServiceServer(client).getAdminPage(1)).comments[0]).toMatchObject({
      liveUrl: null,
      comment: row.comment,
      author: null,
    });
  });

  it('does not expose a live link when the module is disabled', async () => {
    const { client } = buildClient();
    expect(
      (await new CommentServiceServer(client).getAdminPage(1, 'map')).comments[0].liveUrl,
    ).toBeNull();
  });

  it.each([
    { projects: [] },
    { projects: [{ id: 7, slug: 'build', deleted: true }] },
  ])('handles a missing or deleted source', async ({ projects }) => {
    const { client } = buildClient({ sources: { projects } });
    expect((await new CommentServiceServer(client).getAdminPage(1)).comments[0].liveUrl).toBeNull();
  });

  it.each([
    'questions',
    'news',
  ] as const)('resolves %s without hiding readable draft sources', async (type) => {
    const { client } = buildClient({
      rows: [{ ...row, source_type: type }],
      sources: { [type]: [{ id: 7, slug: 'example', deleted: false, is_draft: true }] },
    });
    expect((await new CommentServiceServer(client).getAdminPage(1)).comments[0].liveUrl).toBe(
      `/${type}/example#comment:41`,
    );
  });

  it('resolves the actual research owner and rejects draft/deleted updates', async () => {
    const rows = [7, 8, 9, 10].map((id) => ({
      ...row,
      id,
      source_id: id,
      source_type: 'research_updates' as const,
    }));
    const { client } = buildClient({
      rows,
      sources: {
        research_updates: [
          { id: 7, research: { slug: 'actual-owner', deleted: false }, is_draft: false },
          { id: 8, research: { slug: 'actual-owner', deleted: false }, is_draft: true },
          { id: 9, research: { slug: 'actual-owner', deleted: false }, deleted: true },
          { id: 10, research: { slug: 'deleted-owner', deleted: true }, is_draft: false },
        ],
      },
    });
    expect(
      (await new CommentServiceServer(client).getAdminPage(1)).comments.map((c) => c.liveUrl),
    ).toEqual(['/research/actual-owner?update_7#comment:7', null, null, null]);
  });

  it('allows replies to deleted parents but rejects mismatched or missing parents', async () => {
    const rows = [1, 2, 3, 4].map((parent_id) => ({ ...row, id: parent_id + 40, parent_id }));
    const { client } = buildClient({
      rows,
      parents: [
        { id: 1, parent_id: null, source_id: 7, source_type: 'projects', deleted: true },
        { id: 2, parent_id: null, source_id: 8, source_type: 'projects' },
        { id: 3, parent_id: 1, source_id: 7, source_type: 'projects' },
      ],
    });
    expect(
      (await new CommentServiceServer(client).getAdminPage(1)).comments.map((c) => c.liveUrl),
    ).toEqual(['/library/build#comment:41', null, null, null]);
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
