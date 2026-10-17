import { EllipsisVerticalIcon } from 'lucide-react';
import { observer } from 'mobx-react';
import { Icon, UsefulButtonLite } from 'oa-components';
import type { Reply } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button as UiButton } from 'src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { useUsefulVote } from 'src/stores/UsefulVote/useUsefulVote';
import { Box, Flex } from 'theme-ui';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { EditCommentModal } from '@/components/ui/edit-comment-modal';
import { CommentDisplay } from './CommentDisplay';
import { useCopyCommentLink } from './useCopyCommentLink';

export interface ICommentItemProps {
  comment: Reply;
  onEdit: (id: number, comment: string) => Promise<Response>;
  onDelete: (id: number) => void;
}

export const CommentReply = observer(({ comment, onEdit, onDelete }: ICommentItemProps) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    hasVoted,
    usefulCount,
    toggle: toggleVote,
  } = useUsefulVote('comments', comment.id, comment.voteCount ?? 0);

  const { profile: activeUser } = useProfileStore();

  const isEditable = useMemo(() => {
    return (
      activeUser?.username === comment.createdBy?.username ||
      activeUser?.roles?.includes(UserRole.ADMIN)
    );
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
          paddingRight: [0, 2],
        }}
      >
        <Icon glyph="reply-outline" />
      </Box>
      <Flex
        id={`comment:${comment.id}`}
        data-cy={isEditable ? `Own${item}` : item}
        sx={{ flexDirection: 'column', width: '100%' }}
      >
        <Flex sx={{ gap: 2 }} ref={commentRef as any}>
          <CommentDisplay
            comment={comment}
            menuActions={
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <UiButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      data-cy="ReplyItem: actions button"
                    />
                  }
                >
                  <EllipsisVerticalIcon aria-hidden="true" className="size-3" />
                  <span className="sr-only">Show Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-40">
                  {isEditable && (
                    <DropdownMenuItem
                      data-cy="ReplyItem: edit button"
                      onClick={() => setShowEditModal(true)}
                    >
                      <Icon aria-hidden="true" glyph="edit" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem data-cy="ReplyItem: copy link button" onClick={copyCommentLink}>
                    <Icon aria-hidden="true" glyph="copy-link" />
                    Copy Link
                  </DropdownMenuItem>
                  {isEditable && (
                    <DropdownMenuItem
                      data-cy="ReplyItem: delete button"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Icon aria-hidden="true" glyph="delete" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            }
            footerActions={
              <UsefulButtonLite
                onUsefulClick={async () => await toggleVote()}
                hasUserVotedUseful={hasVoted}
                votedUsefulCount={usefulCount}
                isLoggedIn={!!loggedInUser}
              />
            }
          />
        </Flex>

        <EditCommentModal
          isOpen={showEditModal}
          comment={comment.comment}
          isReply
          onClose={() => setShowEditModal(false)}
          onSubmit={(commentText) => onEdit(comment.id, commentText)}
        />

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
