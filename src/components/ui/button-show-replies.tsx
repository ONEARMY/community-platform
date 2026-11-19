import type { Comment } from 'oa-shared';
import { Button } from '@/components/ui/button';
import ChevronDown from '@/components/ui/icons/chevron-down.svg?react';
import ChevronUp from '@/components/ui/icons/chevron-up.svg?react';

interface IProps {
  isShowReplies: boolean;
  replies: Comment[];
  setIsShowReplies: () => void;
}

export function ButtonShowReplies({ isShowReplies, replies, setIsShowReplies }: IProps) {
  const count = replies.filter(({ deleted }) => deleted !== true).length;
  const Icon = isShowReplies ? ChevronUp : ChevronDown;

  const text = count
    ? `${isShowReplies ? 'Hide' : 'Show'} ${count} ${count === 1 ? 'reply' : 'replies'}`
    : isShowReplies
      ? 'Hide'
      : 'Reply';

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="self-start"
      data-cy="show-replies"
      data-testid="show-replies"
      onClick={setIsShowReplies}
    >
      <Icon data-testid="show-replies-icon" data-icon="inline-start" />
      {text}
    </Button>
  );
}
