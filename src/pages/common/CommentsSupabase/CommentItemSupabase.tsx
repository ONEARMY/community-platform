import { format } from 'date-fns';
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
  Tooltip,
  UsefulButtonLite,
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
import { useAcceptedAnswer } from './hooks/useAcceptedAnswer';
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

interface IAcceptedAnswerLabelProps {
  commentId: number;
  acceptedDate?: Date;
}

const AcceptedAnswerLabel = ({ commentId, acceptedDate }: IAcceptedAnswerLabelProps) => {
  const tooltipId = commentId.toString() + '-accepted-answer';

  return (
    <>
      <Flex
        as="span"
        data-tooltip-id={tooltipId}
        data-tooltip-content={
          acceptedDate
            ? 'Author accepted this answer on ' + format(new Date(acceptedDate), 'd MMM yyyy')
            : undefined
        }
        sx={{
          fontSize: '12px',
          color: '#095A4F',
          alignItems: 'center',
          gap: 1,
          padding: 1,
          borderRadius: 1,
          backgroundColor: '#00C3A933',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.9894 2.48934C16.4431 1.65802 17.496 1.34575 18.3413 1.7919C19.1867 2.23816 19.5043 3.2735 19.0506 4.10485C18.699 4.74894 18.4938 5.07868 17.061 7.22741C15.6145 9.39669 13.1278 12.6567 11.6139 14.5957C10.8998 15.5298 10.2393 16.1551 10.0337 16.4746C9.98102 16.5565 9.79063 16.8719 9.67907 17.0219C9.60698 17.1188 9.42333 17.3578 9.11748 17.5508C8.73143 17.7944 8.26544 17.8958 7.79577 17.8195C7.32963 17.7437 7.00056 17.5106 6.87958 17.4223C6.72056 17.3063 6.57569 17.1735 6.4588 17.0619C6.22425 16.8381 5.91799 16.5181 5.55957 16.1426C3.92687 14.4322 2.899 13.4321 2.27144 12.8607C2.04828 12.6574 1.79384 12.5157 1.55375 12.2517C1.31366 11.9876 0.458734 10.8648 0.839454 10.0542C1.24181 9.19804 2.27437 8.82483 3.14522 9.21998C3.39185 9.332 3.6223 9.50253 3.79504 9.6371C4.00538 9.80099 4.27861 10.0317 4.63319 10.3546C5.31228 10.973 6.33813 11.972 7.88061 13.5814C8.17214 13.2264 8.4509 13.0463 8.84866 12.527L8.85885 12.5139C10.3743 10.573 12.7212 7.50479 14.1553 5.35398C15.603 3.18284 15.7223 2.97856 15.9894 2.48934Z"
            fill="#00C3A9"
            stroke="#1B1B1B"
            stroke-width="1.25"
            stroke-linecap="round"
          />
        </svg>
        Accepted answer
      </Flex>
      {acceptedDate && <Tooltip id={tooltipId} />}
    </>
  );
};

export const CommentItemSupabase = observer((props: ICommentItemProps) => {
  const {
    comment,
    onEdit,
    onDelete,
    onReply,
    onEditReply,
    onDeleteReply,
    updateUsefulCount,
    sourceType,
  } = props;
  const commentRef = useRef<HTMLDivElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplies, setShowReplies] = useState(
    () => !!comment.replies?.some((x) => x.highlighted),
  );
  const { profile } = useProfileStore();
  const {
    hasVoted,
    usefulCount,
    toggle: toggleVote,
  } = useUsefulVote('comments', comment.id, comment.voteCount ?? 0);
  const { isSubscribed: isFollowingReplies, toggle: toggleFollowReplies } = useSubscription(
    'comments',
    comment.id,
  );

  const isEditable = useMemo(() => {
    return (
      profile?.username === comment.createdBy?.username || profile?.roles?.includes(UserRole.ADMIN)
    );
  }, [profile]);

  const acceptedAnswer = useAcceptedAnswer(comment.id);

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
    <Flex
      id={`comment:${comment.id}`}
      data-cy={isEditable ? `OwnCommentItem` : 'CommentItem'}
      sx={{ flexDirection: 'column' }}
    >
      <Card
        sx={{
          flexDirection: 'column',
          padding: 3,
          overflow: 'inherit',
          border: acceptedAnswer?.isAccepted ? '2px solid' : 'none',
          borderColor: acceptedAnswer?.isAccepted ? 'green' : undefined,
        }}
        ref={commentRef as any}
        variant="borderless"
      >
        <CommentDisplay
          isEditable={isEditable}
          itemType={item}
          comment={comment}
          menuActions={
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
                    data-cy="CommentItem: delete button"
                    variant="subtle"
                    icon="delete"
                    onClick={() => setShowDeleteModal(true)}
                    sx={{ fontSize: 1 }}
                  >
                    Delete
                  </Button>
                )}
                {acceptedAnswer?.canMarkAsAccepted && (
                  <Button
                    type="button"
                    data-cy="CommentItem: mark-as-accepted button"
                    variant="subtle"
                    onClick={acceptedAnswer.onAccept}
                    disabled={acceptedAnswer.isLoading}
                    sx={{ fontSize: 1 }}
                  >
                    {acceptedAnswer.isAccepted
                      ? 'Unmark as accepted answer'
                      : 'Mark as accepted answer'}
                  </Button>
                )}
              </ActionSet>
            </>
          }
          footerActions={
            <>
              {acceptedAnswer?.isAccepted && (
                <AcceptedAnswerLabel
                  commentId={comment.id}
                  acceptedDate={acceptedAnswer.acceptedDate}
                />
              )}
              <UsefulButtonLite
                onUsefulClick={async () => await toggleVote()}
                hasUserVotedUseful={hasVoted}
                votedUsefulCount={usefulCount}
                isLoggedIn={!!profile}
              />
            </>
          }
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

              <CreateCommentSupabase
                onSubmit={(comment) => onReply(comment)}
                sourceType={sourceType}
                isReply
              />
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
