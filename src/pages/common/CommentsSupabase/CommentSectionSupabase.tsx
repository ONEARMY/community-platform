import { observer } from 'mobx-react';
import { AuthorsContext, CommentsTitle, FollowButton } from 'oa-components';
import type { DiscussionContentType, Reply } from 'oa-shared';
import { Comment } from 'oa-shared';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { commentService } from 'src/services/commentService';
import { subscribersService } from 'src/services/subscribersService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { useSubscription } from 'src/stores/Subscription/useSubscription';
import { Box, Button, Flex } from 'theme-ui';
import { CommentItemSupabase } from './CommentItemSupabase';
import { CommentSort } from './CommentSort';
import { CommentSortOption, CommentSortOptions } from './CommentSortOptions';
import { CreateCommentSupabase } from './CreateCommentSupabase';

interface IProps {
  authors: Array<number>;
  sourceId: number;
  sourceType: DiscussionContentType;
  setSubscribersCount?: Dispatch<SetStateAction<number>>;
}
const commentPageSize = 10;

export const CommentSectionSupabase = observer((props: IProps) => {
  const { authors, sourceId, sourceType } = props;

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLimit, setCommentLimit] = useState<number>(commentPageSize);
  const [sortBy, setSortBy] = useState<CommentSortOption>(CommentSortOption.Oldest);
  const { isSubscribed, toggle: toggleFollowReplies } = useSubscription(sourceType, sourceId);
  const { profile } = useProfileStore();

  const displayedComments = useMemo(() => {
    const sortFn = CommentSortOptions.getSortFn(sortBy);
    const sorted = [...comments].sort(sortFn);
    return sorted.slice(0, commentLimit);
  }, [comments, commentLimit, sortBy]);

  const remainingCommentsCount = useMemo(() => {
    return Math.max(0, comments.length - commentLimit);
  }, [comments.length, commentLimit]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await commentService.getComments(sourceType, sourceId);
        const highlightedCommentId = location.hash?.startsWith('#comment:') ? location.hash.replace('#comment:', '') : null;

        if (highlightedCommentId) {
          const highlightedComment = comments.find((x) => x.id === +highlightedCommentId);
          if (highlightedComment) {
            highlightedComment.highlighted = true;
          } else {
            // find in replies and set highlighted
            const highlightedReply = comments.flatMap((x) => x.replies).find((x) => x?.id === +highlightedCommentId);

            if (highlightedReply) {
              highlightedReply.highlighted = true;
            }
          }

          // ensure highlighted comment is visible
          const index = comments.findIndex((x) => x.highlighted || x.replies?.some((y) => y.highlighted));

          if (index > 5) {
            setCommentLimit(index + 1);
          }
        }

        setComments(comments || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [sourceId, location?.hash]);

  useEffect(() => {
    if (window.location.hash && window.location.hash === '#discussion') {
      const el = document.getElementById('discussion');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const postComment = async (comment: string) => {
    try {
      const result = await commentService.postComment(sourceId, comment, sourceType);

      if (result.status === 201) {
        const newComment = new Comment(await result.json());
        subscribersService.add(newComment.sourceType, Number(newComment.sourceId));

        setComments((comments) => [...comments, newComment]);
      }
      return result;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const editComment = async (id: number, comment: string) => {
    try {
      const result = await commentService.editComment(sourceId, id, comment);
      const now = new Date();

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((x) => {
            if (x.id === id) {
              x.comment = comment;
              x.modifiedAt = now;
            }
            return x;
          }),
        );
      }
      return result;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const deleteComment = async (id: number) => {
    try {
      const result = await commentService.deleteComment(sourceId, id);

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((x) => {
            if (x.id === id) {
              x.deleted = true;
            }
            return x;
          }),
        );
      }
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  const postReply = async (id: number, reply: string) => {
    try {
      const result = await commentService.postComment(sourceId, reply, sourceType, id);

      if (result.status === 201) {
        const newReply = new Comment(await result.json()) as Reply;

        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === id) {
              comment.replies = [...(comment.replies || []), newReply];
            }
            return comment;
          }),
        );
      }
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  const editReply = async (id: number, replyText: string, parentId: number) => {
    try {
      const result = await commentService.editComment(sourceId, id, replyText);
      const now = new Date();

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === parentId) {
              comment.replies = comment.replies?.map((reply) => {
                if (reply.id === id) {
                  reply.comment = replyText;
                  reply.modifiedAt = now;
                }
                return reply;
              });
            }
            return comment;
          }),
        );
      }
      return result;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const deleteReply = async (id: number, parentId: number) => {
    try {
      const result = await commentService.deleteComment(sourceId, id);

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === parentId) {
              comment.replies = comment.replies?.map((reply) => {
                if (reply.id === id) {
                  reply.deleted = true;
                }
                return reply;
              });
            }
            return comment;
          }),
        );
      }
      return result;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const updateVoteCount = useCallback((id: number, newVoteCount: number) => {
    setComments((comments) =>
      comments.map((comment) => {
        if (comment.id === id) {
          comment.voteCount = newVoteCount;
        }
        return comment;
      }),
    );
  }, []);

  return (
    <AuthorsContext.Provider value={{ authors }}>
      <Flex sx={{ flexDirection: 'column', gap: 2 }} id="discussion">
        <Flex
          sx={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            containerType: 'inline-size',
          }}
        >
          <Flex
            sx={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 1,
              justifyContent: 'space-between',
              flex: '1 1 auto',
            }}
          >
            <CommentsTitle comments={comments} />

            <FollowButton
              isFollowing={isSubscribed}
              isLoggedIn={!!profile}
              labelFollow="Follow Comments"
              labelUnfollow="Following Comments"
              onFollowClick={toggleFollowReplies}
            />
          </Flex>
          {comments.length >= 5 && <CommentSort sortBy={sortBy} onSortChange={setSortBy} />}
        </Flex>
        {displayedComments.map((comment) => (
          <Box key={comment.id}>
            <CommentItemSupabase
              comment={comment}
              onEdit={editComment}
              onDelete={deleteComment}
              onReply={(reply) => postReply(comment.id, reply)}
              onEditReply={(id, reply) => editReply(id, reply, comment.id)}
              onDeleteReply={(id) => deleteReply(id, comment.id)}
              updateUsefulCount={updateVoteCount}
              sourceType={sourceType}
            />
          </Box>
        ))}

        {remainingCommentsCount > 0 && (
          <Flex>
            <Button
              type="button"
              sx={{ margin: '0 auto' }}
              variant="outline"
              data-cy="show-more-comments"
              onClick={() => setCommentLimit((prev) => prev + commentPageSize)}
            >
              {`show ${remainingCommentsCount} more comment${remainingCommentsCount === 1 ? '' : 's'}`}
            </Button>
          </Flex>
        )}

        <CreateCommentSupabase onSubmit={postComment} sourceType={sourceType} />
      </Flex>
    </AuthorsContext.Provider>
  );
});
