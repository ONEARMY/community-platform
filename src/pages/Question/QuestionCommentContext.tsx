import { createContext, useContext } from 'react';

interface QuestionCommentContextType {
  acceptedAnswerId?: number;
  canMarkAsAccepted: boolean;
  onAcceptAnswer: (commentId: number) => Promise<void>;
  isLoading: boolean;
}

export const QuestionCommentContext = createContext<QuestionCommentContextType | null>(null);

export const useQuestionCommentContext = () => {
  const context = useContext(QuestionCommentContext);
  return context;
};
