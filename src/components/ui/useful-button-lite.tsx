import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import StarActiveIcon from '@/components/ui/icons/star-active.svg?react';
import { cn } from '@/lib/utils';

export interface UsefulConfig {
  hasUserVotedUseful: boolean;
  votedUsefulCount: number;
  isLoggedIn: boolean;
  onUsefulClick: (vote: 'add' | 'delete', eventCategory?: string) => Promise<void>;
}

export function UsefulButtonLite({
  hasUserVotedUseful,
  votedUsefulCount,
  isLoggedIn,
  onUsefulClick,
}: UsefulConfig) {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

  const handleClick = async () => {
    if (!isLoggedIn) {
      navigate(`/sign-in?returnUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }

    setDisabled(true);
    try {
      await onUsefulClick(hasUserVotedUseful ? 'delete' : 'add', 'Comment');
    } catch (_) {}
    setDisabled(false);
  };

  return (
    <div className="relative flex items-center self-end">
      {votedUsefulCount > 0 && (
        <span className="-mr-3.5 z-10 flex h-6 min-w-11 items-center rounded-l-sm bg-background py-1 pr-1 pl-2 text-sm">
          {votedUsefulCount}
        </span>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative z-20"
        data-cy={isLoggedIn ? 'vote-useful' : 'vote-useful-redirect'}
        title={isLoggedIn ? 'Mark as useful' : 'Login to add your vote'}
        disabled={disabled}
        onClick={handleClick}
      >
        <StarActiveIcon
          className={cn('size-6', !hasUserVotedUseful && 'grayscale')}
          data-testid="useful-icon"
        />
      </Button>
    </div>
  );
}
