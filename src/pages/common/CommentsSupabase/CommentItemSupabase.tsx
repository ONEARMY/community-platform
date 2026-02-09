import { observer } from 'mobx-react';
import {
  ActionSet,
  Button,
  ButtonShowReplies,
  CommentDisplay,
  ConfirmModal,
  EditComment,
  FollowButton,
  FollowIcon,
  Modal,
} from 'oa-components';
import type { Comment, DiscussionContentType } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { useSubscription } from 'src/stores/Subscription/useSubscription';
import { useUsefulVote } from 'src/stores/UsefulVote/useUsefulVote';
import { Card, Flex } from 'theme-ui';
import { CommentReply } from './CommentReplySupabase';
import { CreateCommentSupabase } from './CreateCommentSupabase';
import { useCopyCommentLink } from './useCopyCommentLink';

export interface ICommentItemProps {
  comment: Comment;
  onEdit: (id: number, comment: string) => Promise<Response>;
  onDelete: (id: number) => void;
  onReply: (reply: string) => void;
  onEditReply: (id: number, reply: string) => Promise<Response>;
  onDeleteReply: (id: number) => void;
  updateUsefulCount?: (id: number, newVoteCount: number) => void;
  sourceType: DiscussionContentType;
}

export const CommentItemSupabase = observer((props: ICommentItemProps) => {
  const { comment, onEdit, onDelete, onReply, onEditReply, onDeleteReply, updateUsefulCount, sourceType } = props;
  const commentRef = useRef<HTMLDivElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplies, setShowReplies] = useState(() => !!comment.replies?.some((x) => x.highlighted));
  const { profile } = useProfileStore();
  const { hasVoted, usefulCount, toggle: toggleVote } = useUsefulVote('comments', comment.id, comment.voteCount ?? 0);
  const { isSubscribed: isFollowingReplies, toggle: toggleFollowReplies } = useSubscription('comments', comment.id);

  const isEditable = useMemo(() => {
    return profile?.username === comment.createdBy?.username || profile?.roles?.includes(UserRole.ADMIN);
  }, [profile]);

  const item = 'CommentItem';

  // Update parent component with new vote count when it changes
  useEffect(() => {
    updateUsefulCount?.(comment.id, usefulCount);
  }, [usefulCount, comment.id, updateUsefulCount]);

  useEffect(() => {
    if (comment.highlighted) {
      commentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [comment.highlighted]);

  const copyCommentLink = useCopyCommentLink(comment);

  return (
    <Flex id={`comment:${comment.id}`} data-cy={isEditable ? `OwnCommentItem` : 'CommentItem'} sx={{ flexDirection: 'column' }}>
      <Card sx={{ flexDirection: 'column', padding: 3, overflow: 'inherit' }} ref={commentRef as any} variant="borderless">
        <CommentDisplay
          isEditable={isEditable}
          itemType={item}
          comment={comment}
          actions={
            <>
              {!!profile && isFollowingReplies && (
                <Flex sx={{ display: ['none', 'inline'] }}>
                  <FollowIcon tooltip="Following replies" />
                </Flex>
              )}
              <ActionSet itemType="CommentItem">
                <FollowButton
                  isLoggedIn={!!profile}
                  isFollowing={isFollowingReplies}
                  onFollowClick={toggleFollowReplies}
                  labelFollow="Follow replies"
                  labelUnfollow="Unfollow replies"
                  variant="subtle"
                  sx={{ fontSize: 1 }}
                />
                {isEditable && (
                  <Button
                    type="button"
                    data-cy="CommentItem: edit button"
                    variant="subtle"
                    icon="edit"
                    onClick={() => setShowEditModal(true)}
                    sx={{ fontSize: 1 }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  type="button"
                  data-cy="CommentItem: copy link button"
                  variant="subtle"
                  icon="copy-link"
                  onClick={copyCommentLink}
                  sx={{ fontSize: 1 }}
                >
                  Copy Link
                </Button>
                {isEditable && (
                  <Button
                    type="button"
                    data-cy="CommentItem delete button"
                    variant="subtle"
                    icon="delete"
                    onClick={() => setShowDeleteModal(true)}
                    sx={{ fontSize: 1 }}
                  >
                    Delete
                  </Button>
                )}
              </ActionSet>
            </>
          }
          usefulButtonConfig={{
            onUsefulClick: async () => await toggleVote(),
            hasUserVotedUseful: hasVoted,
            votedUsefulCount: usefulCount,
            isLoggedIn: !!profile,
          }}
        />

        <Flex
          sx={{
            alignItems: 'stretch',
            flexDirection: 'column',
            flex: 1,
            gap: 4,
            marginTop: 3,
          }}
        >
          {showReplies && (
            <>
              {comment.replies?.map((x) => (
                <CommentReply
                  key={x.id}
                  comment={x}
                  onEdit={async (id: number, comment: string) => {
                    return await onEditReply(id, comment);
                  }}
                  onDelete={(id: number) => onDeleteReply(id)}
                />
              ))}

              <CreateCommentSupabase onSubmit={(comment) => onReply(comment)} sourceType={sourceType} isReply />
            </>
          )}
          <ButtonShowReplies
            isShowReplies={showReplies}
            replies={(comment.replies || []) as any}
            setIsShowReplies={() => setShowReplies(!showReplies)}
          />
        </Flex>
      </Card>

      <Modal width={600} isOpen={showEditModal} onDismiss={() => setShowEditModal(false)}>
        <EditComment
          comment={comment.comment}
          handleSubmit={async (commentText) => {
            return await onEdit(comment.id, commentText);
          }}
          setShowEditModal={setShowEditModal}
          handleCancel={() => setShowEditModal(false)}
          isReply={false}
        />
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        message="Are you sure you want to delete this comment?"
        confirmButtonText="Delete"
        handleCancel={() => setShowDeleteModal(false)}
        handleConfirm={async () => {
          onDelete(comment.id);
          setShowDeleteModal(false);
        }}
        confirmVariant="destructive"
      />
    </Flex>
  );
});
