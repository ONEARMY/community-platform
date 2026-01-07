import React from 'react';
import { observer } from 'mobx-react';
import { UserRole } from 'oa-shared';
import { useProfileStore } from 'src/stores/Profile/profile.store';

import type { PremiumTier, Profile } from 'oa-shared';

interface IProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  tierRequired: PremiumTier;
}

export const PremiumTierWrapper = observer((props: IProps) => {
  const { children, fallback, tierRequired } = props;
  const { profile } = useProfileStore();

  const hasRequiredTier = userHasPremiumTier(profile, tierRequired);

  return <>{hasRequiredTier ? children : fallback || null}</>;
});

export const userHasPremiumTier = (
  profile?: Profile | null,
  tierRequired?: PremiumTier,
): boolean => {
  if (!tierRequired || tierRequired <= 0) {
    return true;
  }

  if (!profile) {
    return false;
  }

  if (profile.roles?.includes(UserRole.ADMIN)) {
    return true;
  }

  if (!profile.badges || profile.badges.length === 0) {
    return false;
  }

  return profile.badges.some((badge) => badge.premiumTier === tierRequired);
};
