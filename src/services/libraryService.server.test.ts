import { createClient } from '@supabase/supabase-js';
import { LibraryServiceServer } from 'src/services/libraryService.server';
import { describe, expect, it } from 'vitest';

import type { DBAdminProject } from 'oa-shared';

const dbAdminProject: DBAdminProject = {
  id: 4,
  created_at: '2026-08-19T10:00:00Z',
  title: 'Plastic bench',
  slug: 'plastic-bench',
  difficulty_level: 'medium',
  moderation: 'accepted',
  is_draft: null,
  published_at: '2026-08-20T10:00:00Z',
  comment_count: 3,
  total_views: 120,
  deleted: null,
  profile: { username: 'owner', display_name: 'Owner' },
  category: { name: 'Furniture' },
  steps: [{ count: 5 }],
  remakes: [{ count: 2 }],
};

const buildClient = (
  response: { status: number; body: unknown; contentRange?: string } = {
    status: 200,
    body: [dbAdminProject],
    contentRange: '20-20/41',
  },
) => {
  const requests: URL[] = [];
  const client = createClient('https://supabase.example', 'test-key', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: async (input) => {
        requests.push(new URL(String(input)));

        return new Response(JSON.stringify(response.body), {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            ...(response.contentRange ? { 'Content-Range': response.contentRange } : {}),
          },
        });
      },
    },
  });

  return { client, requests };
};

describe('LibraryServiceServer.getAdminPage', () => {
  it('requests one page of projects, newest first, with their counts', async () => {
    const { client, requests } = buildClient();

    await new LibraryServiceServer(client).getAdminPage(2, 20);

    expect(requests).toHaveLength(1);
    expect(requests[0].pathname).toBe('/rest/v1/projects');
    expect(requests[0].searchParams.get('order')).toBe('created_at.desc,id.desc');
    expect(requests[0].searchParams.get('offset')).toBe('20');
    expect(requests[0].searchParams.get('limit')).toBe('20');
    expect(requests[0].searchParams.get('select')).toMatch(
      /profile:profiles\(username,display_name\)[\s\S]*category:categories\(name\)[\s\S]*steps:project_steps\(count\)[\s\S]*remakes\(count\)/,
    );
  });

  it('maps each row and returns the total count', async () => {
    const { client } = buildClient();

    const { projects, totalCount } = await new LibraryServiceServer(client).getAdminPage(2, 20);

    expect(totalCount).toBe(41);
    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      id: 4,
      title: 'Plastic bench',
      slug: 'plastic-bench',
      author: { username: 'owner', displayName: 'Owner' },
      category: 'Furniture',
      difficultyLevel: 'medium',
      moderation: 'accepted',
      isDraft: false,
      publishedAt: new Date('2026-08-20T10:00:00Z'),
      commentCount: 3,
      totalViews: 120,
      stepCount: 5,
      remakeCount: 2,
      deleted: false,
    });
  });

  it('keeps projects whose author or category is unavailable', async () => {
    const { client } = buildClient({
      status: 200,
      body: [{ ...dbAdminProject, profile: null, category: null, steps: [], remakes: [] }],
      contentRange: '0-0/1',
    });

    const { projects } = await new LibraryServiceServer(client).getAdminPage(1, 20);

    expect(projects[0]).toMatchObject({
      author: null,
      category: null,
      stepCount: 0,
      remakeCount: 0,
    });
  });

  it('returns an empty page when the page is past the last one', async () => {
    const { client } = buildClient({
      status: 416,
      body: { code: 'PGRST103', message: 'Requested range not satisfiable' },
    });

    await expect(new LibraryServiceServer(client).getAdminPage(99, 20)).resolves.toEqual({
      projects: [],
      totalCount: 0,
    });
  });

  it('throws when the query fails', async () => {
    const { client } = buildClient({
      status: 403,
      body: { code: '42501', message: 'permission denied' },
    });

    await expect(new LibraryServiceServer(client).getAdminPage(1, 20)).rejects.toMatchObject({
      code: '42501',
    });
  });
});
