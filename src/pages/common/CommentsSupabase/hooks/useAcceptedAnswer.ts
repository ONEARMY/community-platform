import { useQuestionCommentContext } from 'src/pages/Question/QuestionCommentContext';

interface UseAcceptedAnswerReturn {
  isAccepted: boolean;
  acceptedDate?: Date;
  canMarkAsAccepted: boolean;
  onAccept: () => Promise<void>;
  isLoading: boolean;
  hasAcceptedAnswer: boolean;
}

export const useAcceptedAnswer = (commentId: number): UseAcceptedAnswerReturn | null => {
  const context = useQuestionCommentContext();

  if (!context) {
    return null;
  }

  return {
    isAccepted: context.acceptedAnswerId === commentId,
    acceptedDate: context.acceptedAnswerId === commentId ? context.acceptedAnswerDate : undefined,
    canMarkAsAccepted: context.canMarkAsAccepted,
    onAccept: () => context.onAcceptAnswer(commentId),
    isLoading: context.isLoading,
    hasAcceptedAnswer: !!context.acceptedAnswerId,
  };
};
