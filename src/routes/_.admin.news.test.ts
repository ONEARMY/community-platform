import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { describe, expect, it, vi } from 'vitest';
import { loader } from './_.admin.news';

vi.mock('src/repository/supabase.server');
vi.mock('src/pages/Admin/News/NewsPage', () => ({ NewsPage: () => null }));

describe('_.admin.news route loader', () => {
  it('loads news and resolves tags and categories', async () => {
    const mockNewsData = [
      {
        id: 1,
        title: 'News Post 1',
        slug: 'news-post-1',
        category: { id: 5, name: 'Updates' },
        tags: [1, 2],
        moderation: 'accepted',
        is_draft: false,
        published_at: '2026-08-20T10:00:00Z',
        comment_count: 3,
        total_views: 50,
        poll: 42,
        deleted: false,
        profiles: { display_name: 'Author Name', username: 'author' },
      },
    ];
    const mockTagsData = [
      { id: 1, name: 'Tag One' },
      { id: 2, name: 'Tag Two' },
    ];
    const newsSelectBuilder = {
      order: vi.fn().mockResolvedValue({ data: mockNewsData, error: null }),
    };
    const tagsSelectBuilder = vi.fn().mockResolvedValue({ data: mockTagsData, error: null });
    const client = {
      from: vi.fn((table: string) => {
        if (table === 'news') {
          return {
            select: vi.fn().mockReturnValue(newsSelectBuilder),
          };
        }
        if (table === 'tags') {
          return {
            select: tagsSelectBuilder,
          };
        }
        return { select: vi.fn() };
      }),
    };
    (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      client,
      headers: new Headers(),
    });
    const result = await loader({
      request: new Request('http://localhost/admin/news'),
      params: {},
      context: {},
    } as any);
    expect(result.news).toHaveLength(1);
    expect(result.news[0].title).toBe('News Post 1');
    expect(result.news[0].slug).toBe('news-post-1');
    expect(result.news[0].category).toEqual({ id: 5, name: 'Updates' });
    expect(result.news[0].tags).toEqual(['Tag One', 'Tag Two']);
    expect(result.news[0].hasPoll).toBe(true);
    expect(result.news[0].authorDisplayName).toBe('Author Name');
    expect(result.news[0].authorUserName).toBe('author');
  });
});
