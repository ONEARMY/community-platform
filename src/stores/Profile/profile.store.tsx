import { createContext, useContext, useEffect } from 'react';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { SessionContext } from 'src/pages/common/SessionContext';
import { profileService } from 'src/services/profileService';
import { profileTypesService } from 'src/services/profileTypesService';
import { upgradeBadgeService } from 'src/services/upgradeBadgeService';

import type { Profile, ProfileType, UpgradeBadge } from 'oa-shared';

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

  getUpgradeBadgeForCurrentUser = () => {
    if (!this.profile || !this.upgradeBadges) {
      return undefined;
    }

    const isSpace = this.profile.type?.isSpace || false;
    const upgradeBadge = this.upgradeBadges.find((badge) => badge.isSpace === isSpace);

    const userBadgeIds = this.profile.badges?.map((badge) => badge.id) || [];
    const hasUpgradeBadge = upgradeBadge ? userBadgeIds.includes(upgradeBadge.badgeId) : false;

    return hasUpgradeBadge ? undefined : upgradeBadge;
  };

  getProfileTypeByName = (name: string) => {
    return this.profileTypes?.find((type) => type.name === name);
  };

  constructor() {
    makeObservable(this, {
      profile: observable,
      profileTypes: observable,
      upgradeBadges: observable,
      refresh: action,
      clear: action,
      update: action,
      initProfileTypes: action,
      initUpgradeBadges: action,
    });
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
