import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commentService } from './commentService';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('commentService.getComments', () => {
  it('returns the response comments without adding a query when no highlight is supplied', async () => {
    const comments = [{ id: 41, comment: 'A comment' }];
    fetchMock.mockResolvedValue(Response.json({ comments }));
    await expect(commentService.getComments('projects', 7)).resolves.toEqual(comments);
    expect(fetchMock).toHaveBeenCalledWith('/api/discussions/projects/7/comments');
  });

  it('encodes the highlighted comment value as a single query parameter', async () => {
    fetchMock.mockResolvedValue(Response.json({ comments: [] }));
    const commentId = '41&other=2 +#?';
    await commentService.getComments('questions', 7, commentId);
    const url = new URL(fetchMock.mock.calls[0][0], 'http://localhost');
    expect(url.pathname).toBe('/api/discussions/questions/7/comments');
    expect([...url.searchParams.entries()]).toEqual([['commentId', commentId]]);
  });

  it.each([400, 403, 404, 500])('rejects HTTP %s before reading a success-shaped body', async (status) => {
    const response = Response.json({ comments: [{ id: 41 }] }, { status });
    const readJson = vi.spyOn(response, 'json');
    fetchMock.mockResolvedValue(response);
    await expect(commentService.getComments('projects', 7)).rejects.toThrow(
      'Could not load comments. Please try again.',
    );
    expect(readJson).not.toHaveBeenCalled();
  });

  it('propagates a network rejection instead of returning an empty discussion', async () => {
    fetchMock.mockRejectedValue(new Error('network unavailable'));
    await expect(commentService.getComments('projects', 7)).rejects.toThrow('network unavailable');
  });
});
