import { useEffect, useRef, useState } from 'react';
import { LinkifyText } from '@/components/ui/linkify-text';
import { cn } from '@/lib/utils';

interface IProps {
  body: string;
}

export const CommentBody = ({ body }: IProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el && !isExpanded) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [body, isExpanded]);

  return (
    <>
      <p
        ref={textRef}
        data-cy="comment-text"
        data-testid="commentText"
        className={cn(
          'm-0 text-base leading-snug break-words whitespace-pre-wrap',
          !isExpanded && 'line-clamp-5',
        )}
      >
        <LinkifyText>{body.trim()}</LinkifyText>
      </p>
      {isClamped && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="cursor-pointer self-start text-base text-muted-foreground hover:underline"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </>
  );
};
