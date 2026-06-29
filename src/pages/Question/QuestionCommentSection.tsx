import { observer } from 'mobx-react';
import type { Question } from 'oa-shared';
import { Dispatch, SetStateAction, useState } from 'react';
import { hasAdminRights } from 'src/utils/helpers';
import { Card } from 'theme-ui';
import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase';
import { QuestionCommentContext } from './QuestionCommentContext';

interface IProps {
  question: Question;
  activeUser?: any;
  onAcceptAnswerChange?: (commentId?: number) => Promise<void>;
  setSubscribersCount?: Dispatch<SetStateAction<number>>;
}

export const QuestionCommentSection = observer(
  ({ question, activeUser, onAcceptAnswerChange, setSubscribersCount }: IProps) => {
    const [acceptedAnswerId, setAcceptedAnswerId] = useState(
      question.acceptedAnswerId || undefined,
    );
    const [isLoading, setIsLoading] = useState(false);

    const canMarkAsAccepted =
      !!activeUser && (activeUser.id === question.author?.id || hasAdminRights(activeUser));

    const handleAcceptAnswer = async (commentId: number) => {
      setIsLoading(true);
      try {
        const newAcceptedId = acceptedAnswerId === commentId ? undefined : commentId;
        setAcceptedAnswerId(newAcceptedId);
        await onAcceptAnswerChange?.(newAcceptedId);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <QuestionCommentContext.Provider
        value={{
          acceptedAnswerId,
          canMarkAsAccepted,
          onAcceptAnswer: handleAcceptAnswer,
          isLoading,
        }}
      >
        <Card
          data-cy="comments-section"
          variant="responsive"
          sx={{
            background: 'softblue',
            borderTop: 0,
            padding: [3, 4],
            marginTop: [0, 2, 4],
          }}
        >
          <CommentSectionSupabase
            authors={question.author?.id ? [question.author.id] : []}
            setSubscribersCount={setSubscribersCount}
            sourceId={question.id}
            sourceType="questions"
          />
        </Card>
      </QuestionCommentContext.Provider>
    );
  },
);
