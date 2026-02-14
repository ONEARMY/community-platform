import { observer } from 'mobx-react';
import { ActionSet, Button, CommentDisplay, ConfirmModal, EditComment, Icon, Modal } from 'oa-components';
import type { Reply } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { useUsefulVote } from 'src/stores/UsefulVote/useUsefulVote';
import { Box, Flex, Text } from 'theme-ui';
import { useCopyCommentLink } from './useCopyCommentLink';

const DELETED_COMMENT = 'The original comment got deleted';

export interface ICommentItemProps {
  comment: Reply;
  onEdit: (id: number, comment: string) => Promise<Response>;
  onDelete: (id: number) => void;
}

export const CommentReply = observer(({ comment, onEdit, onDelete }: ICommentItemProps) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { hasVoted, usefulCount, toggle: toggleVote } = useUsefulVote('comments', comment.id, comment.voteCount ?? 0);

  const { profile: activeUser } = useProfileStore();

  const isEditable = useMemo(() => {
    return activeUser?.username === comment.createdBy?.username || activeUser?.roles?.includes(UserRole.ADMIN);
  }, [activeUser, comment]);

  useEffect(() => {
    if (comment.highlighted) {
      commentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [comment.highlighted]);

  const item = 'ReplyItem';
  const loggedInUser = activeUser;

  const copyCommentLink = useCopyCommentLink(comment);

  return (
    <Flex>
      <Box
        sx={{
          paddingTop: 1,
          paddingRight: 2,
        }}
      >
        <Icon glyph="reply-outline" />
      </Box>
      <Flex id={`comment:${comment.id}`} data-cy={isEditable ? `Own${item}` : item} sx={{ flexDirection: 'column', width: '100%' }}>
        <Flex sx={{ gap: 2 }} ref={commentRef as any}>
          {comment.deleted ? (
            <Box
              sx={{
                marginBottom: 2,
                border: `${comment.highlighted ? '2px dashed black' : 'none'}`,
              }}
              data-cy="deletedComment"
            >
              <Text sx={{ color: 'grey' }}>[{DELETED_COMMENT}]</Text>
            </Box>
          ) : (
            <CommentDisplay
              isEditable={isEditable}
              itemType={item}
              comment={comment}
              actions={
                <ActionSet itemType="ReplyItem">
                  {isEditable && (
                    <Button
                      type="button"
                      data-cy="ReplyItem: edit button"
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
                    data-cy="ReplyItem: copy link button"
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
                      data-cy="ReplyItem: delete button"
                      variant="subtle"
                      icon="delete"
                      onClick={() => setShowDeleteModal(true)}
                      sx={{ fontSize: 1 }}
                    >
                      Delete
                    </Button>
                  )}
                </ActionSet>
              }
              usefulButtonConfig={{
                onUsefulClick: async () => await toggleVote(),
                hasUserVotedUseful: hasVoted,
                votedUsefulCount: usefulCount,
                isLoggedIn: !!loggedInUser,
              }}
            />
          )}
        </Flex>

        <Modal width={600} isOpen={showEditModal} onDismiss={() => setShowEditModal(false)}>
          <EditComment
            comment={comment.comment}
            handleSubmit={async (commentText) => {
              return await onEdit(comment.id, commentText);
            }}
            setShowEditModal={setShowEditModal}
            handleCancel={() => setShowEditModal(false)}
            isReply={true}
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
    </Flex>
  );
});
