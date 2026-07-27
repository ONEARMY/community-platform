import type { Comment } from 'oa-shared';
import { useContext } from 'react';
import { Box, Flex, Text } from 'theme-ui';
import { CommentAvatar } from '../CommentAvatar/CommentAvatar';
import { CommentBody } from '../CommentBody/CommentBody';
import { DisplayDate } from '../DisplayDate/DisplayDate';
import { AuthorsContext } from '../providers/AuthorsContext';
import { Username } from '../Username/Username';

export interface IProps {
  comment: Comment;
  itemType: 'ReplyItem' | 'CommentItem';
  isEditable: boolean | undefined;
  menuActions: React.ReactNode;
  footerActions: React.ReactNode;
}

const DELETED_COMMENT = 'The original comment got deleted';

export const CommentDisplay = (props: IProps) => {
  const { comment, menuActions, footerActions } = props;

  const { authors } = useContext(AuthorsContext);
  const border = `${comment.highlighted ? '2px dashed black' : 'none'}`;

  if (comment.deleted) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          border,
        }}
        data-cy="deletedComment"
      >
        <Text sx={{ color: 'grey' }}>[{DELETED_COMMENT}]</Text>
      </Box>
    );
  }

  if (!comment.deleted) {
    return (
      <Flex
        sx={{
          gap: 2,
          flexGrow: 1,
          border,
        }}
        data-cy={comment.highlighted ? 'highlighted-comment' : ''}
      >
        <Box
          data-cy="commentAvatar"
          data-testid="commentAvatar"
          sx={{
            flexDirection: 'column',
            position: 'relative',
            display: ['none', 'inline-block'],
          }}
        >
          <CommentAvatar
            displayName={comment.createdBy?.displayName}
            photo={comment.createdBy?.photo?.publicUrl}
            isCommentAuthor={
              comment.createdBy?.id ? authors.includes(comment.createdBy?.id) : false
            }
          />
        </Box>

        <Flex sx={{ flexDirection: 'column', flex: 1 }}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Flex
              sx={{
                gap: 2,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: ['flex', 'none'], position: 'relative', flexShrink: 0 }}>
                  <CommentAvatar
                    displayName={comment.createdBy?.displayName}
                    photo={comment.createdBy?.photo?.publicUrl}
                    isCommentAuthor={
                      comment.createdBy?.id ? authors.includes(comment.createdBy?.id) : false
                    }
                  />
                </Box>
                {comment.createdBy && <Username user={comment.createdBy} />}
                <Text sx={{ fontSize: 1, color: 'darkGrey' }}>
                  <DisplayDate createdAt={comment.createdAt} showLabel={false} />
                </Text>
              </Flex>

              {menuActions && <Flex sx={{ alignItems: 'center', gap: 1 }}>{menuActions}</Flex>}
            </Flex>
            <Flex
              sx={{
                flexDirection: 'column',
              }}
            >
              <CommentBody body={comment.comment} />

              {footerActions && (
                <Flex sx={{ gap: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                  {footerActions}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
};
