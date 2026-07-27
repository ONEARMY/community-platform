import { DBProfile, Profile, UserRole } from 'oa-shared';

export const isUserAdmin = (user: DBProfile | Profile) => {
  return user.roles && user.roles.includes(UserRole.ADMIN);
};
