import { useState } from 'react';
import { Alert, Box } from 'theme-ui';

import { CreateComment } from '../CreateComment/CreateComment';

export interface Props {
  commentId: string;
  isLoggedIn: boolean;
  maxLength: number;
  onSubmit: (_id: string, reply: string) => Promise<void>;
}

export const CreateReply = (props: Props) => {
  const [reply, setReply] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { commentId, isLoggedIn, maxLength, onSubmit } = props;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(commentId, reply);
      setReply('');
      setIsLoading(false);
    } catch (_) {
      // Swallow the error for now
      setIsLoading(false);
      setIsError(true);
    }
  };

  return (
    <Box
      sx={{
        background: 'softblue',
        borderRadius: 2,
        marginBottom: 3,
        padding: 3,
      }}
    >
      <CreateComment
        maxLength={maxLength}
        comment={reply}
        onChange={(text) => setReply(text)}
        onSubmit={handleSubmit}
        isLoggedIn={isLoggedIn}
        isLoading={isLoading}
        isReply
        buttonLabel="Leave a reply"
      />
      {isError ? (
        <Alert variant="failure" sx={{ mt: 3 }}>
          Unable to leave a comment at this time. Please try again later.
        </Alert>
      ) : null}
    </Box>
  );
};
