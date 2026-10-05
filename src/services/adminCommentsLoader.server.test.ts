import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loader } from 'src/routes/_.admin.comments';

const mocks = vi.hoisted(() => ({ getAdminPage: vi.fn(), getSettings: vi.fn() }));
vi.mock('src/repository/supabase.server', () => ({
  createSupabaseServerClient: () => ({ client: {} }),
}));
vi.mock('src/services/commentService.server', () => ({
  CommentServiceServer: class {
    getAdminPage = mocks.getAdminPage;
  },
}));
vi.mock('src/services/tenantSettingsService.server', () => ({
  TenantSettingsService: class {
    get = mocks.getSettings;
  },
}));
vi.mock('src/pages/Admin/Comments/CommentsPage', () => ({ CommentsPage: () => null }));

const load = (search = '') =>
  loader({ request: new Request(`http://localhost/admin/comments${search}`) } as never);

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSettings.mockResolvedValue({ supportedModules: 'questions' });
  mocks.getAdminPage.mockResolvedValue({ comments: [], page: 1, totalPages: 3 });
});

describe('admin comments page URL', () => {
  it('loads page one without redirecting when the page parameter is absent', async () => {
    expect(await load('?keep=x')).toEqual({ comments: [], page: 1, totalPages: 3 });
    expect(mocks.getAdminPage).toHaveBeenCalledWith(1, 'questions');
  });

  it('returns a valid canonical page without redirecting', async () => {
    mocks.getAdminPage.mockResolvedValue({ comments: [], page: 2, totalPages: 3 });
    expect(await load('?page=2&keep=x')).toEqual({ comments: [], page: 2, totalPages: 3 });
    expect(mocks.getAdminPage).toHaveBeenCalledWith(2, 'questions');
  });

  it('removes duplicate page values while preserving unrelated repeated parameters', async () => {
    mocks.getAdminPage.mockResolvedValue({ comments: [], page: 2, totalPages: 3 });
    const result = await load('?keep=x&page=2&keep=y&page=3');
    expect(result).toBeInstanceOf(Response);
    const redirect = result as Response;
    expect(redirect.status).toBe(302);
    const url = new URL(redirect.headers.get('Location')!, 'http://localhost');
    expect(url.pathname).toBe('/admin/comments');
    expect(url.searchParams.getAll('page')).toEqual(['2']);
    expect(url.searchParams.getAll('keep')).toEqual(['x', 'y']);
    expect(mocks.getAdminPage).toHaveBeenCalledWith(2, 'questions');
  });

  it.each([
    ['0', 1, 1],
    ['-3', 1, 1],
    ['invalid', 1, 1],
    ['', 1, 1],
    ['02', 2, 2],
    ['2.5', 2, 2],
    ['999', 999, 3],
  ])('canonicalizes page=%s to the effective page', async (rawPage, requestedPage, effectivePage) => {
    mocks.getAdminPage.mockResolvedValue({ comments: [], page: effectivePage, totalPages: 3 });
    const result = await load(`?page=${rawPage}&keep=x`);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).headers.get('Location')).toBe(
      `/admin/comments?page=${effectivePage}&keep=x`,
    );
    expect(mocks.getAdminPage).toHaveBeenCalledWith(requestedPage, 'questions');
  });
});
