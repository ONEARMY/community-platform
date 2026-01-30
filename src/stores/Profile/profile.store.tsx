import { createContext, useContext, useEffect } from 'react';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { SessionContext } from 'src/pages/common/SessionContext';
import { profileService } from 'src/services/profileService';
import { profileTypesService } from 'src/services/profileTypesService';
import { upgradeBadgeService } from 'src/services/upgradeBadgeService';

import type { Profile, ProfileType, UpgradeBadge, UserRole } from 'oa-shared';

export class ProfileStore {
  profile?: Profile = undefined;
  profileTypes?: ProfileType[] = undefined;
  upgradeBadges?: UpgradeBadge[] = undefined;

  refresh = async () => {
    const profile = await profileService.get();
    runInAction(() => {
      // runInAction because of async method
      this.profile = profile;
    });
  };

  clear = () => {
    this.profile = undefined;
  };

  update = (value: Profile) => {
    this.profile = value;
  };

  initProfileTypes = async () => {
    const profileTypes = await profileTypesService.getProfileTypes();

    runInAction(() => {
      // runInAction because of async method
      this.profileTypes = profileTypes;
    });
  };

  initUpgradeBadges = async () => {
    const upgradeBadges = await upgradeBadgeService.getUpgradeBadges();

    runInAction(() => {
      this.upgradeBadges = upgradeBadges;
    });
  };

  getProfileTypeByName = (name: string) => {
    return this.profileTypes?.find((type) => type.name === name);
  };

  isUserAuthorized = (roleRequired?: UserRole | UserRole[]) => {
    const userRoles = this.profile?.roles || [];

    // If no role required just check if user is logged in
    if (!roleRequired || roleRequired.length === 0) {
      return this.profile ? true : false;
    }

    const rolesRequired = Array.isArray(roleRequired) ? roleRequired : [roleRequired];

    // otherwise use logged in user profile values
    if (this.profile && roleRequired) {
      return userRoles.some((role) => rolesRequired.includes(role as UserRole));
    }

    return false;
  };

  constructor() {
    makeObservable(this, {
      profile: observable,
      profileTypes: observable,
      upgradeBadges: observable,
      upgradeBadgeForCurrentUser: computed,
      refresh: action,
      clear: action,
      update: action,
      initProfileTypes: action,
      initUpgradeBadges: action,
    });
  }

  get upgradeBadgeForCurrentUser() {
    if (!this.profile || !this.upgradeBadges) {
      return undefined;
    }

    const isSpace = this.profile.type?.isSpace || false;
    const upgradeBadge = this.upgradeBadges.find((badge) => badge.isSpace === isSpace);

    const userBadgeIds = this.profile.badges?.map((badge) => badge.id) || [];
    const hasUpgradeBadge = upgradeBadge ? userBadgeIds.includes(upgradeBadge.badgeId) : false;

    return hasUpgradeBadge ? undefined : upgradeBadge;
  }
}

const profileStore = new ProfileStore();

const ProfileStoreContext = createContext<ProfileStore | null>(null);

export const ProfileStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const claims = useContext(SessionContext);

  useEffect(() => {
    if (!claims?.sub) {
      profileStore.clear();
      return;
    }

    profileStore.refresh();
  }, [claims?.sub]);

  useEffect(() => {
    profileStore.initProfileTypes();
    profileStore.initUpgradeBadges();
  }, []);

  return (
    <ProfileStoreContext.Provider value={profileStore}>{children}</ProfileStoreContext.Provider>
  );
};

export const useProfileStore = () => {
  const store = useContext(ProfileStoreContext);

  if (!store) {
    throw new Error('useProfileStore must be used within ProfileStoreProvider');
  }

  return store;
};
