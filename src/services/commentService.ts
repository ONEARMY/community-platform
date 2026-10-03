import type { Comment, DiscussionContentType } from 'oa-shared';

const deleteComment = async (sourceId: string | number, id: number) => {
  return await fetch(`/api/discussions/${sourceId}/comments/${id}`, {
    method: 'DELETE',
  });
};

const editComment = async (sourceId: string | number, id: number, comment: string) => {
  return await fetch(`/api/discussions/${sourceId}/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      comment,
    }),
  });
};

const postComment = async (
  sourceId: string | number,
  comment: string,
  sourceType: DiscussionContentType,
  parentId?: number,
) => {
  return await fetch(`/api/discussions/${sourceType}/${sourceId}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      comment,
      parentId,
    }),
  });
};

const getComments = async (
  sourceType: DiscussionContentType,
  sourceId: string | number,
  commentId?: string,
) => {
  const search = commentId ? `?${new URLSearchParams({ commentId })}` : '';
  const result = await fetch(`/api/discussions/${sourceType}/${sourceId}/comments${search}`);
  if (!result.ok) {
    throw new Error('Could not load comments. Please try again.');
  }
  const { comments } = (await result.json()) as { comments: Comment[] };
  return comments;
};

const getCommentSourceId = async (commentId: number) => {
  const result = await fetch(`/api/comments/${commentId}/source`);
  const { sourceId } = (await result.json()) as { sourceId: number };

  return sourceId;
};

export const commentService = {
  getComments,
  getCommentSourceId,
  postComment,
  editComment,
  deleteComment,
};
