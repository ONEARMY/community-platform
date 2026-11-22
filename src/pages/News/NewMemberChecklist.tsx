import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Check from '@/components/ui/icons/check.svg?react';
import ChevronDown from '@/components/ui/icons/chevron-down.svg?react';
import ChevronRight from '@/components/ui/icons/chevron-right.svg?react';
import ChevronUp from '@/components/ui/icons/chevron-up.svg?react';
import { cn } from '@/lib/utils';
import { checklist } from './labels';

type ChecklistAction = {
  label: string;
  href?: string;
  isComplete: boolean;
  isPrimary: boolean;
};

const rowClassName = 'flex items-center gap-3 py-2';
const markerClassName =
  'flex size-6 shrink-0 items-center justify-center rounded-full bg-softblue text-xs';

const ChecklistItem = ({ action, number }: { action: ChecklistAction; number: number }) => {
  if (action.isComplete) {
    return (
      <li className={rowClassName} data-cy="checklist-item-complete">
        <span className={markerClassName} aria-hidden="true">
          <Check className="size-4 text-green" />
        </span>
        <span className="text-muted-foreground line-through">{action.label}</span>
      </li>
    );
  }

  const content = (
    <>
      <span className={markerClassName} aria-hidden="true">
        {number}
      </span>
      <span className="flex-1">{action.label}</span>
      <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
    </>
  );

  return (
    <li data-cy="checklist-item-todo">
      {action.href ? (
        <Link to={action.href} className={cn(rowClassName, 'hover:underline')}>
          {content}
        </Link>
      ) : (
        <div className={rowClassName}>{content}</div>
      )}
    </li>
  );
};

export const NewMemberChecklist = observer(({ className }: { className?: string }) => {
  const { profile, isComplete } = useProfileStore();
  const [isOpen, setIsOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(true);
  const storageKey = `newMemberChecklistDismissed_${profile?.id}`;

  useEffect(() => {
    if (profile) {
      setIsDismissed(localStorage.getItem(storageKey) === 'true');
    }
  }, [profile?.id]);

  if (!profile || profile.type?.isSpace || isDismissed) {
    return null;
  }

  const actions: ChecklistAction[] = [
    { label: checklist.actions.createAccount, isComplete: true, isPrimary: true },
    {
      label: checklist.actions.completeProfile,
      href: '/settings',
      isComplete: !!isComplete,
      isPrimary: true,
    },
    { label: checklist.actions.shareWithFriend, isComplete: false, isPrimary: false },
    { label: checklist.actions.downloadApp, isComplete: false, isPrimary: false },
  ];

  const nextAction = actions.find((action) => !action.isComplete);
  const completedCount = actions.filter((action) => action.isComplete).length;
  const progress = Math.round((completedCount / actions.length) * 100);
  const isPrimaryComplete = actions.every((action) => !action.isPrimary || action.isComplete);

  const dismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsDismissed(true);
  };

  return (
    <Card
      variant="outline"
      className={cn('overflow-hidden', className)}
      data-cy="new-member-checklist"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex flex-col">
            <h2 className="text-base leading-tight">{checklist.title}</h2>
            {nextAction && (
              <p className="text-xs text-muted-foreground" data-cy="checklist-next-step">
                {`${checklist.nextStep}: ${nextAction.label}`}
              </p>
            )}
          </div>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={isOpen ? checklist.hideSteps : checklist.showSteps}
                title={isOpen ? checklist.hideSteps : checklist.showSteps}
              />
            }
          >
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            <ol className="flex flex-col pt-2 text-sm">
              {actions.map((action, index) => (
                <ChecklistItem key={action.label} action={action} number={index + 1} />
              ))}
            </ol>

            {isPrimaryComplete && (
              <Button
                variant="secondary"
                className="mt-2 w-full"
                onClick={dismiss}
                data-cy="checklist-done"
              >
                <Check />
                {checklist.done}
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>

        <div
          role="progressbar"
          aria-label={checklist.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="-mb-4 mt-4 h-1 w-full overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full bg-green" style={{ width: `${progress}%` }} />
        </div>
      </Collapsible>
    </Card>
  );
});
