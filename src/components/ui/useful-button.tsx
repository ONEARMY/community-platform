import { Toggle } from '@base-ui/react/toggle';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import OneArmyLogo from './icons/one-army-logo.svg?react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export interface UsefulButtonProps {
  hasUserVotedUseful: boolean;
  isLoggedIn: boolean;
  onUsefulClick: () => Promise<void>;
}

export function UsefulButton({ hasUserVotedUseful, isLoggedIn, onUsefulClick }: UsefulButtonProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isPending, setIsPending] = useState(false);

  const handlePressedChange = async () => {
    if (!isLoggedIn) {
      navigate(`/sign-in?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isPending) {
      return;
    }

    setIsPending(true);
    try {
      await onUsefulClick();
    } catch {
      return;
    } finally {
      setIsPending(false);
    }
  };

  const button = (
    <Toggle
      type="button"
      data-slot="useful-button"
      data-cy={isLoggedIn ? 'vote-useful' : 'vote-useful-redirect'}
      pressed={hasUserVotedUseful}
      onPressedChange={handlePressedChange}
      disabled={isPending}
      className="relative inline-flex h-useful-control shrink-0 cursor-pointer items-center justify-center rounded-s border-2 border-outline bg-background pr-3 pl-9 font-heading text-sm font-normal whitespace-nowrap text-foreground transition-colors duration-200 outline-none hover:bg-softblue focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-3 flex -translate-y-px items-center"
        aria-hidden="true"
      >
        <OneArmyLogo className={cn('size-useful-icon', !hasUserVotedUseful && 'grayscale')} />
      </span>
      {hasUserVotedUseful ? 'Marked as useful' : 'Mark as useful'}
    </Toggle>
  );

  if (isLoggedIn) {
    return button;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={button} />
        <TooltipContent>Login to add your vote</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
