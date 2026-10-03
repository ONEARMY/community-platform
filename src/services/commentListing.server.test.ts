import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loader } from 'src/routes/api.discussions.$sourceType.$sourceId.comments';

const mocks = vi.hoisted(() => ({
  getClaims: vi.fn(),
  getDiscussionComments: vi.fn(),
  fromDBCommentsToThreads: vi.fn(),
}));

vi.mock('src/repository/supabase.server', () => ({
  createSupabaseServerClient: () => ({
    client: { auth: { getClaims: mocks.getClaims } },
    headers: new Headers({ 'x-comment-test': 'preserved' }),
  }),
}));
vi.mock('src/services/commentService.server', () => ({
  CommentServiceServer: class {
    getDiscussionComments = mocks.getDiscussionComments;
  },
}));
vi.mock('src/factories/commentFactory.server', () => ({
  CommentFactory: class {
    fromDBCommentsToThreads = mocks.fromDBCommentsToThreads;
  },
}));
vi.mock('src/services/imageService.server', () => ({ ImageServiceServer: class {} }));

const load = (sourceType: string | undefined, search = '', sourceId: string | undefined = '7') =>
  loader({
    request: new Request(`http://localhost/api/discussions/projects/7/comments${search}`),
    params: { sourceType, sourceId },
  } as never);

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getClaims.mockResolvedValue({ data: null });
  mocks.getDiscussionComments.mockResolvedValue([]);
  mocks.fromDBCommentsToThreads.mockResolvedValue([]);
});

describe('comment listing request boundary', () => {
  it.each([undefined, 'comments', 'invalid'])('rejects invalid source type %s', async (sourceType) => {
    expect((await load(sourceType)).init?.status).toBe(400);
    expect(mocks.getClaims).not.toHaveBeenCalled();
    expect(mocks.getDiscussionComments).not.toHaveBeenCalled();
  });

  it('rejects a missing source before querying', async () => {
    expect((await load('projects', '', '')).init?.status).toBe(400);
    expect(mocks.getDiscussionComments).not.toHaveBeenCalled();
  });

  it.each(['', '0', '-1', '1.5', 'not-a-number', 'Infinity', '9007199254740992'])(
    'rejects invalid highlighted comment ID %s',
    async (commentId) => {
      const result = await load('projects', `?${new URLSearchParams({ commentId })}`);
      expect(result.init?.status).toBe(400);
      expect(mocks.getDiscussionComments).not.toHaveBeenCalled();
    },
  );

  it.each(['projects', 'questions', 'news', 'research_updates'])(
    'passes a valid highlighted comment and %s source to the discussion service',
    async (sourceType) => {
      const result = await load(sourceType, '?commentId=41');
      expect(mocks.getDiscussionComments).toHaveBeenCalledWith(sourceType, '7', null, 41);
      expect(result.data).toEqual({ comments: [] });
      expect(new Headers(result.init?.headers).get('x-comment-test')).toBe('preserved');
    },
  );

  it('loads the discussion without requesting a highlighted comment when omitted', async () => {
    await load('projects');
    expect(mocks.getDiscussionComments).toHaveBeenCalledWith('projects', '7', null, null);
  });

  it('returns a server error when the discussion load fails', async () => {
    mocks.getDiscussionComments.mockRejectedValue(new Error('query failed'));
    expect((await load('projects')).init?.status).toBe(500);
    expect(mocks.fromDBCommentsToThreads).not.toHaveBeenCalled();
  });
});
