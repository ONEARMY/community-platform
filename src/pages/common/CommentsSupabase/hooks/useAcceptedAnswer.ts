import { useQuestionCommentContext } from 'src/pages/Question/QuestionCommentContext';

interface UseAcceptedAnswerReturn {
  isAccepted: boolean;
  canMarkAsAccepted: boolean;
  onAccept: () => Promise<void>;
  isLoading: boolean;
}

export const useAcceptedAnswer = (commentId: number): UseAcceptedAnswerReturn | null => {
  const context = useQuestionCommentContext();

  if (!context) return null;

  return {
    isAccepted: context.acceptedAnswerId === commentId,
    canMarkAsAccepted: context.canMarkAsAccepted,
    onAccept: () => context.onAcceptAnswer(commentId),
    isLoading: context.isLoading,
  };
};
