import React from 'react';
import { observer } from 'mobx-react';
import { useProfileStore } from 'src/stores/Profile/profile.store';

import type { Profile } from 'oa-shared';

interface IProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  tierRequired: number;
}

export const PremiumTierWrapper = observer((props: IProps) => {
  const { children, fallback, tierRequired } = props;
  const { profile } = useProfileStore();

  const hasRequiredTier = userHasPremiumTier(profile, tierRequired);

  return <>{hasRequiredTier ? children : fallback || null}</>;
});

export const userHasPremiumTier = (user?: Profile | null, tierRequired?: number): boolean => {
  if (!tierRequired || tierRequired <= 0) {
    return true;
  }

  if (!user?.badges || user.badges.length === 0) {
    return false;
  }

  return user.badges.some((badge) => badge.premiumTier === tierRequired);
};
