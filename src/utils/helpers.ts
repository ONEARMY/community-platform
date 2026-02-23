import type { DBProfile, IModeration, Profile } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { DEFAULT_PUBLIC_CONTACT_PREFERENCE } from 'src/pages/UserSettings/constants';

const specialCharactersPattern = /[^a-zA-Z0-9_-]/gi;

// remove special characters from string, also replacing spaces with dashes
export const stripSpecialCharacters = (text: string) => {
  return text ? text.split(' ').join('-').replace(specialCharactersPattern, '') : '';
};

// get special characters from string using the same pattern as stripSpecialCharacters
export const getSpecialCharacters = (text: string): string[] => Array.from(text.matchAll(specialCharactersPattern)).map((x) => x[0]);

// convert to lower case and remove any special characters
export const formatLowerNoSpecial = (text: string) => {
  return stripSpecialCharacters(text).toLowerCase();
};

// take an array of objects and convert to an single object, using a unique key
// that already exists in the array element, i.e.
// [{id:'abc',val:'hello'},{id:'def',val:'world'}] = > {abc:{id:abc,val:'hello}, def:{id:'def',val:'world'}}
export const arrayToJson = (arr: any[], keyField: string) => {
  const json = {};
  arr.forEach((el) => {
    if (Object.hasOwn(el, keyField)) {
      const key = el[keyField];
      json[key] = el;
    }
  });
  return json;
};

export const numberWithCommas = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

// Take a string and capitalises the first letter
// hello world => Hello world
export const capitalizeFirstLetter = (str: string) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/************************************************************************
 *              Date Methods
 ***********************************************************************/
export const getMonth = (d: Date, monthType: 'long' | 'short' = 'long') => {
  // use ECMAScript Internationalization API to return month
  return `${d.toLocaleString('en-us', { month: monthType })}`;
};
export const getDay = (d: Date) => {
  return `${d.getDate()}`;
};

export const hasAdminRights = (user?: Partial<Profile>) => {
  if (!user) {
    return false;
  }
  const roles = user.roles && Array.isArray(user.roles) ? user.roles : [];

  return roles.includes(UserRole.ADMIN);
};

export const hasAdminRightsSupabase = (user?: DBProfile) => {
  if (!user) {
    return false;
  }

  const roles = user.roles && Array.isArray(user.roles) ? user.roles : [];

  return roles.includes(UserRole.ADMIN);
};

export const needsModeration = (doc: IModeration, user?: Profile) => {
  if (!hasAdminRights(user)) {
    return false;
  }
  return doc.moderation !== 'accepted';
};

export const isUserBlockedFromMessaging = (user: Partial<Profile> | null | undefined) => {
  if (!user) {
    return null;
  }
  return user.isBlockedFromMessaging;
};

export const isUserContactable = (user: Partial<Profile>) => {
  if (typeof user.isContactable === 'boolean') {
    return isContactable(user.isContactable);
  }

  return isContactable(null);
};

export const isContactable = (preference: boolean | null) => {
  return typeof preference === 'boolean' ? preference : DEFAULT_PUBLIC_CONTACT_PREFERENCE;
};

export const getProjectEmail = (subject: string) => {
  const siteName = import.meta.env.VITE_SITE_NAME || process.env.VITE_SITE_NAME;
  return `mailto:platform@onearmy.earth?subject=${subject}%20${siteName}`;
};

export const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const buildStatisticsLabel = ({
  stat,
  statUnit,
  usePlural,
}: {
  stat: number | undefined;
  statUnit: string;
  usePlural: boolean;
}): string => {
  if (stat === 1 || !usePlural) {
    return `${statUnit}`;
  }

  return `${statUnit}s`;
};
