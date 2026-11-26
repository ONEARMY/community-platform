import { VisitorModal, visitorDisplayData } from 'oa-components';
import type { Profile, UserVisitorPreferencePolicy } from 'oa-shared';
import { useState } from 'react';
import { badgeVariants } from '@/components/ui/badge';
import InformationIcon from '@/components/ui/icons/information.svg?react';
import { cn } from '@/lib/utils';

const policyVariants: Record<UserVisitorPreferencePolicy, 'success' | 'info' | 'outline'> = {
  open: 'success',
  appointment: 'info',
  closed: 'outline',
};

interface IProps {
  user: Profile;
  onContact?: () => void;
}

export const ProfileVisitorPolicy = ({ user, onContact }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const policy = user.visitorPolicy?.policy;
  const label = policy && visitorDisplayData.get(policy)?.label;

  if (!user.type?.isSpace || !policy || !label) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        data-cy="tag-openToVisitors"
        onClick={() => setIsOpen(true)}
        className={cn(badgeVariants({ variant: policyVariants[policy] }), 'cursor-pointer text-sm')}
      >
        {label}
        <InformationIcon aria-hidden="true" />
      </button>
      <VisitorModal
        show={isOpen}
        user={user}
        canContact={!!onContact}
        hide={(target) => {
          setIsOpen(false);
          if (target === 'contact') {
            onContact?.();
          }
        }}
      />
    </>
  );
};
